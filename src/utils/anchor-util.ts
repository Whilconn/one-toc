import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL, TOC_LEVEL } from '../shared/constants';
import { genPathSelector, getLevel, getRect, getText } from './dom-util';

const INVALID_DISPLAYS = ['none'];
const INVALID_SELECTORS = [
  'header',
  'aside',
  '.aside',
  '.side',
  '.left',
  '.right',
  'footer',
  '.foot',
  '.footer',
  '.comment',
];

export function getAnchors() {
  const selector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];
  nodes = filterNodes(nodes);
  nodes = shiftTitle(nodes);
  nodes = filterByFontSize(nodes);
  markAnchors(nodes);

  return nodes;
}

function filterByFontSize(nodes: HTMLElement[]) {
  const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  const styleMap = nodes.reduce(
    (map, node) => map.set(node, getComputedStyle(node)),
    new WeakMap<HTMLElement, CSSStyleDeclaration>(),
  );

  const getSize = (style: CSSStyleDeclaration) => +style.fontSize.replace(/[^0-9]/g, '') || 0;

  // 记录 h1~h6 各组最大字号
  const sizeDict = nodes.reduce((dict, node) => {
    const style = styleMap.get(node);
    if (style && node.matches(headSelector)) {
      const l = getLevel(node) - 1;
      dict[l] = Math.max(dict[l] || 0, getSize(style));
    }
    return dict;
  }, [] as number[]);

  // 剔除 h1~h6 各组中字号偏小的节点
  nodes = nodes.filter((node) => {
    const style = styleMap.get(node);
    if (!style || !node.matches(headSelector)) return true;

    const l = getLevel(node) - 1;
    return sizeDict[l] === getSize(style);
  });

  // 记录前 MAX_LEVEL 个字号
  const MAX_LEVEL = HEADING_SELECTORS.length;
  const sizeSet = nodes.reduce((set, node) => {
    const style = styleMap.get(node);
    const fontSize = style ? getSize(style) : -1;
    if (fontSize > 0 && set.size < MAX_LEVEL) set.add(fontSize);
    return set;
  }, new Set<number>());

  // 剔除字号小于 最小size 的节点
  const minSize = Math.min(...sizeSet);
  nodes = nodes.filter((node) => {
    const style = styleMap.get(node);
    if (!style) return true;

    return getSize(style) >= minSize;
  });

  // 标记层级
  const sizeArr = [...sizeSet].sort((a, b) => b - a);
  nodes.forEach((node) => {
    const style = styleMap.get(node);
    if (!style) return;

    const l = sizeArr.indexOf(getSize(style));
    if (l >= 0) node.setAttribute(TOC_LEVEL, l.toString());
  });

  return nodes;
}

function filterNodes(nodes: HTMLElement[]) {
  const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  const invalidSelector = INVALID_SELECTORS.join(SYMBOL.COMMA);

  return nodes.filter((node) => {
    // 没有文字
    if (!getText(node)) return false;

    // 节点不在文章主体中，如header、footer、sidebar等
    if (node.closest(invalidSelector)) return false;

    // 祖先节点有h1~h6
    if (node?.parentElement?.closest(headSelector)) return false;

    // 宽高过小
    const MIN = 8;
    const { width, height } = getRect(node);
    if (width < MIN && height < MIN) return false;

    // 距离父节点左边界过远
    const LEFT = 100;
    if (node.offsetLeft > LEFT) return false;

    const style = getComputedStyle(node);

    // 没有加粗
    const FONT_WEIGHT = 500;
    if (+style.fontWeight < FONT_WEIGHT) return false;

    // 隐藏节点、fixed节点
    return !INVALID_DISPLAYS.includes(style.display) && !FIXED_POSITIONS.includes(style.position);
  });
}

function markAnchors(nodes: HTMLElement[]) {
  nodes.map((n, i) => (n.id = n.id || `toc-anchor-${i}`));
}

// TODO：添加分组策略，按左右边界是否对齐过滤

/**
 * @description 剔除文章标题
 * @param nodes
 */
function shiftTitle(nodes: HTMLElement[] = []) {
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
