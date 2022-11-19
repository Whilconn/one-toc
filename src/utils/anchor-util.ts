import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL, TOC_LEVEL } from '../shared/constants';
import { findAncestor, getFontSize, getLevel, getNextNode, getPrevNode, getRect, getText, isHeading } from './dom-util';

const INLINE = 'inline';
const INVALID_DISPLAYS = ['none'];
const INVALID_SELECTORS = [
  'aside',
  'footer',
  '.side',
  '.foot',
  '.left',
  '.right',
  '.comment',
  '.comments',
  '.recommend',
  '[class*=aside]',
  '[class*=footer]',
];

export function getAnchors() {
  const selector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];

  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, CSSStyleDeclaration>();

  for (const node of nodes) {
    rectMap.set(node, getRect(node));
    styleMap.set(node, getComputedStyle(node));
  }

  nodes = filterBasic(nodes, styleMap, rectMap);
  nodes = removeTitle(nodes);

  nodes = filterByLayout(nodes, rectMap);
  const count = nodes.length;
  nodes = filterById(nodes);

  if (count === nodes.length) {
    nodes = filterByFontSize(nodes, styleMap);
  }

  nodes = calcLevel(nodes, styleMap);
  nodes = markAnchors(nodes);

  return nodes;
}

function filterByLayout(nodes: HTMLElement[], rectMap: WeakMap<HTMLElement, DOMRect>) {
  const widthMap = new Map<number, number>();
  const leftMap = new Map<number, number>();

  const MID = window.innerWidth / 2;
  const maxWidth = Math.min(window.innerWidth / 3, 600);

  return nodes.filter((node) => {
    const rect = rectMap.get(node);
    if (!rect || !isHeading(node)) return true;

    // 需要横跨中轴
    if (MID < rect.left || MID > rect.right) return false;

    // 宽度不能过小
    return rect.width >= maxWidth;
  });
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

function isOneLine(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect) {
  if (isHeading(node) || !rect || !style?.display.includes(INLINE)) return true;

  // 非 h1~h6 的节点，必须独占一行
  const prevNode = getPrevNode(node);
  const nextNode = getNextNode(node);

  const y1 = prevNode ? getRect(prevNode).bottom : -Infinity;
  const y2 = nextNode ? getRect(nextNode).top : Infinity;

  const BREAK = '\n';
  const prevText = prevNode?.textContent || '';
  const nextText = nextNode?.textContent || '';

  return (y1 <= rect.top || prevText.endsWith(BREAK)) && (rect.bottom <= y2 || nextText.startsWith(BREAK));
}

// 仅修改计算后的样式信息和布局信息（直接修改节点样式会导致页面布局改变甚至破坏）
function inlineToBlock(
  node: HTMLElement,
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const rect = rectMap.get(node);
  const style = styleMap.get(node);
  if (!style || !rect || isHeading(node) || !style.display.includes(INLINE)) return;

  const ancestor = findAncestor(node, (n) => {
    return !getComputedStyle(n).display.includes(INLINE);
  });

  styleMap.set(node, { ...style, display: 'block' });
  rect.width = ancestor ? ancestor.getBoundingClientRect().width : window.innerWidth;

  if (import.meta.env.DEV) console.error('修改节点styleMap、rectMap', node);
}

function filterBasic(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  const invalidSelector = INVALID_SELECTORS.join(SYMBOL.COMMA);
  const MIN = 10;

  return nodes.filter((node, i) => {
    // 没有文字
    if (!getText(node)) return false;

    // 节点不在文章主体中，如footer、sidebar等
    if (node.closest(invalidSelector)) return false;

    // 祖先节点有h1~h6
    if (node?.parentElement?.closest(headSelector)) return false;

    const rect = rectMap.get(node);
    const style = styleMap.get(node);
    if (!style || !rect) return true;

    // 宽高过小
    if (Math.min(rect.width, rect.height) < MIN) return false;

    // 剔除隐藏节点、fixed节点
    if (INVALID_DISPLAYS.includes(style.display) || FIXED_POSITIONS.includes(style.position)) return false;

    // 必须独占一行
    if (!isOneLine(node, style, rect)) return false;

    inlineToBlock(node, styleMap, rectMap);

    // 剔除与相邻标题的 top 或 bottom 相等的节点
    return ![nodes[i - 1], nodes[i + 1]].some((n) => {
      const r = rectMap.get(n);
      return r?.top === rect.top || r?.bottom === rect.bottom;
    });
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
  let titleNode: HTMLElement;
  const h1Nodes: HTMLElement[] = [];

  nodes.forEach((node) => {
    if (node.tagName === 'H1') h1Nodes.push(node);

    const text = getText(node);
    if (!titleNode && text && document.title.includes(text)) titleNode = node;
  });

  return nodes.filter((n) => {
    if (titleNode) return n !== titleNode;
    if (h1Nodes.length === 1) return n !== h1Nodes[0];
    return true;
  });
}
