import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL, TOC_LEVEL } from '../shared/constants';
import { genPathSelector, getFontSize, getLevel, getRect, getText, isHeading } from './dom-util';

const INVALID_DISPLAYS = ['none'];
const INVALID_SELECTORS = [
  'header',
  'aside',
  'footer',
  '.left',
  '.right',
  '.side',
  '.foot',
  '.comment',
  '.comments',
  '.blog_comment',
  '[class*=aside]',
  '[class*=footer]',
  '[class*=recommend]',
];

export function getAnchors() {
  const selector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];
  const styleMap = nodes.reduce(
    (map, node) => map.set(node, getComputedStyle(node)),
    new WeakMap<HTMLElement, CSSStyleDeclaration>(),
  );
  const rectMap = nodes.reduce((map, node) => map.set(node, getRect(node)), new WeakMap<HTMLElement, DOMRect>());

  nodes = filterNodes(nodes, styleMap, rectMap);
  nodes = removeTitle(nodes);
  nodes = filterHeadings(nodes, rectMap);
  const count = nodes.length;
  nodes = filterById(nodes);

  if (count === nodes.length) {
    nodes = filterBoldNodes(nodes);
    nodes = filterByFontSize(nodes, styleMap);
  }

  nodes = calcLevel(nodes, styleMap);
  nodes = markAnchors(nodes);

  return nodes;
}

function filterHeadings(nodes: HTMLElement[], rectMap: WeakMap<HTMLElement, DOMRect>) {
  const maxWidth = nodes.reduce((w, n) => (isHeading(n) ? Math.max(w, rectMap.get(n)?.width || 0) : w), 0);
  return nodes.filter((node) => !isHeading(node) || (rectMap.get(node)?.width || 0) > maxWidth * 0.75);
}

function filterById(nodes: HTMLElement[]) {
  const idNodes = nodes.filter((node) => node.id || node.getAttribute('name'));
  return idNodes.length ? idNodes : nodes;
}

function filterByFontSize(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  // 记录 h1~h6 各组最大字号
  const sizeDict = nodes.reduce((dict, node) => {
    const style = styleMap.get(node);
    if (style && isHeading(node)) {
      const l = getLevel(node);
      dict[l] = Math.max(dict[l] || 0, getFontSize(style));
    }
    return dict;
  }, [] as number[]);

  const MIN_FS = 13;

  return nodes.filter((node) => {
    const style = styleMap.get(node);
    if (!style) return true;

    // 剔除小于 13px 的标题
    const fontSize = getFontSize(style);
    if (fontSize < MIN_FS) return false;

    // 剔除 h1~h6 各组中字号偏小的节点
    return !isHeading(node) || sizeDict[getLevel(node)] === fontSize;
  });
}

function filterNodes(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  const invalidSelector = INVALID_SELECTORS.join(SYMBOL.COMMA);
  const LEFT = window.innerWidth / 3;

  return nodes.filter((node) => {
    // 没有文字
    if (!getText(node)) return false;

    // 节点不在文章主体中，如header、footer、sidebar等
    if (node.closest(invalidSelector)) return false;

    // 祖先节点有h1~h6
    if (node?.parentElement?.closest(headSelector)) return false;

    // 宽高过小
    const MIN = 10;
    const rect = rectMap.get(node);
    if (rect && Math.min(rect.width, rect.height) < MIN) return false;

    // 距离父节点左边界过远
    if (node.offsetLeft > LEFT) return false;

    const style = styleMap.get(node);
    if (!style) return true;

    // 没有加粗
    // const FONT_WEIGHT = 500;
    // if (+style.fontWeight < FONT_WEIGHT) return false;

    // 隐藏节点、fixed节点
    return !INVALID_DISPLAYS.includes(style.display) && !FIXED_POSITIONS.includes(style.position);
  });
}

function filterBoldNodes(nodes: HTMLElement[]) {
  const hc = nodes.reduce((c, n) => c + (isHeading(n) ? 1 : 0), 0);

  return nodes.filter((node) => {
    if (isHeading(node)) return true;

    if (hc > 1) return false;

    if ([node.previousSibling, node.nextSibling].some((n) => getText(n))) return false;

    return true;
  });
}

function calcLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  // 记录所有字号
  const sizeSet = nodes.reduce((set, node) => {
    const style = styleMap.get(node);
    const fontSize = style ? getFontSize(style) : -1;
    return set.add(fontSize);
  }, new Set<number>());

  const sizeArr = [...sizeSet]
    .filter((s) => s > 0)
    .sort((a, b) => b - a)
    .slice(0, HEADING_SELECTORS.length);

  // 剔除字号小于 最小size 的节点
  const minSize = sizeArr[sizeArr.length - 1];
  nodes = nodes.filter((node) => {
    const style = styleMap.get(node);
    return !style || getFontSize(style) >= minSize;
  });

  // 标记层级
  nodes.forEach((node) => {
    const style = styleMap.get(node);
    if (!style) return;

    const l = isHeading(node) ? getLevel(node) : sizeArr.indexOf(getFontSize(style));
    if (l >= 0) node.setAttribute(TOC_LEVEL, l.toString());
  });

  return nodes;
}

function markAnchors(nodes: HTMLElement[]) {
  nodes.forEach((n, i) => (n.id = n.id || `toc-anchor-${i}`));
  return nodes;
}

// TODO：添加分组策略，按左右边界是否对齐过滤

/**
 * @description 剔除文章标题
 * @param nodes
 */
function removeTitle(nodes: HTMLElement[] = []) {
  const H1 = 'H1';
  const firstH1 = nodes.find((n) => n.tagName === H1);
  if (firstH1?.tagName !== H1) return nodes;

  const text = getText(firstH1);
  if (text === document.title) return nodes.slice(1);

  const secondH1 = nodes.find((n, i) => i && n.tagName === H1);
  if (!secondH1 || genPathSelector(secondH1) !== genPathSelector(firstH1)) {
    return nodes.slice(1);
  }

  return nodes;
}
