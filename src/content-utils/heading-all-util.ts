import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL } from '../shared/constants';
import { getFontSize, getLineHeight, getNextNode, getPrevNode, getRect, getText, isHeading } from './dom-util';

const MW = 10;
const MIN_FS = 14;
const INVALID_DISPLAYS = ['none'];

// h1-h6
const tagHeadingSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
// b/strong
const boldHeadingSelector = BOLD_SELECTORS.join(SYMBOL.COMMA);

// TODO: 优先级 h1#id > article h1 > h1 > article b,strong > b,strong > style: bold、fs>=16 > 语义
export function getAllHeadings(articleNode: HTMLElement) {
  const hTagHeadings: HTMLElement[] = [];
  const bTagHeadings: HTMLElement[] = [];
  const styleHeadings: HTMLElement[] = [];
  const semanticHeadings: HTMLElement[] = [];

  const reg = /^([一二三四五六七八九十百千万零]+|\d+|[a-z])[、.·,，\s].+/i;

  const walker = document.createTreeWalker(articleNode, NodeFilter.SHOW_ELEMENT);
  let node = walker.root as HTMLElement;

  while ((node = walker.nextNode() as HTMLElement)) {
    const rect = getRect(node);
    const style = getComputedStyle(node);
    if (!isFitRuleP0(node, style, rect)) continue;

    if (node.matches(tagHeadingSelector)) {
      hTagHeadings.push(node);
    } else if (getLineCount(node, style, rect) === 1) {
      if (node.matches(boldHeadingSelector)) bTagHeadings.push(node);

      // 样式匹配，样式是加粗或居中对齐
      const styleFit = +style.fontWeight >= 500 || getFontSize(style) >= 16;
      if (styleFit) styleHeadings.push(node);

      // 语义匹配，文本开头是序号
      const text = getText(node);
      if (reg.test(text)) semanticHeadings.push(node);
    }
  }

  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, Styles>();
  const headings = [...hTagHeadings, ...bTagHeadings, ...styleHeadings, ...semanticHeadings];
  for (const node of headings) {
    if (!rectMap.has(node)) rectMap.set(node, getRect(node));
    if (!styleMap.has(node)) styleMap.set(node, fixHeadingStyle(node));
  }

  return {
    hTagHeadings,
    bTagHeadings,
    styleHeadings,
    semanticHeadings,
    styleMap,
    rectMap,
  };
}

export function mergeHeadings(nodes: HTMLElement[]) {
  return nodes
    .sort((a, b) => {
      if (a === b) return 0;
      // Node.DOCUMENT_POSITION_FOLLOWING, Node.DOCUMENT_POSITION_CONTAINED_BY
      return [4, 16].includes(a.compareDocumentPosition(b)) ? -1 : 1;
    })
    .filter((n, i, nodes) => {
      return i === 0 || !(n.contains(nodes[i - 1]) || nodes[i - 1].contains(n));
    });
}

const headingSelector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

function isFitRuleP0(node: HTMLElement, style: Styles, rect: DOMRect) {
  // 必须有文字内容
  if (!getText(node)) return false;

  // 不能是评论内容
  if (isNoiseNode(node)) return false;

  // 不能是嵌套的heading节点，如h1 h2,h1 b,h2 strong 等
  if (node.parentElement?.closest(headingSelector)) return false;

  // 宽高不小于 10px
  if (Math.min(rect.width, rect.height) < MW) return false;

  // 字号不小于 14px 的
  if (getFontSize(style) < MIN_FS) return false;

  // 不能是隐藏节点、fixed节点
  if (INVALID_DISPLAYS.includes(style.display) || FIXED_POSITIONS.includes(style.position)) return false;

  // 必须独占一行
  return isOneLine(node, style, rect);
}

function isNoiseNode(node: HTMLElement) {
  const selector = 'header,aside,footer,nav,.recommend,#recommend';
  return !!node.closest(selector);
}

// 修正 heading 的字体、字号、颜色等样式
function fixHeadingStyle(node: HTMLElement) {
  const text = getText(node);
  const style = getComputedStyle(node);
  if (!text) return style;

  const childNode = [...node.children].find((c) => {
    const childText = getText(c);
    if (text.startsWith(childText)) return c;
  });

  if (!childNode) return style;

  const childStyle = getComputedStyle(childNode);
  const { color, fontSize, fontFamily, fontWeight } = childStyle;

  return { ...style, color, fontSize, fontFamily, fontWeight };
}

// 非 h1~h6 的节点，必须独占一行
function isOneLine(node: HTMLElement, style: Styles, rect: DOMRect) {
  if (isHeading(node)) return true;

  // 文字换行则判定为不是标题
  const lineCount = getLineCount(node, style, rect);
  if (lineCount > 1) return false;

  const prevNode = getPrevNode(node);
  const nextNode = getNextNode(node);

  const y1 = prevNode ? getRect(prevNode).bottom : -Infinity;
  const y2 = nextNode ? getRect(nextNode).top : Infinity;

  const prevText = prevNode?.textContent || '';
  const nextText = nextNode?.textContent || '';

  // 前后节点与当前节点不在同一行
  return (y1 <= rect.top || /[\r\n]\s*$/.test(prevText)) && (rect.bottom <= y2 || /^\s*[\r\n]/.test(nextText));
}

function getLineCount(node: HTMLElement, style: Styles, rect: DOMRect) {
  return Math.ceil(rect.height / Math.max(getLineHeight(style), getFontSize(style)));
}

export type Styles = Omit<
  CSSStyleDeclaration,
  'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'
>;

export type StyleMap = WeakMap<HTMLElement, Styles>;

export type RectMap = WeakMap<HTMLElement, DOMRect>;
