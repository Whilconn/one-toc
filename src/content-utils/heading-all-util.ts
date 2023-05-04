import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL } from '../shared/constants';
import { getFontSize, getNextNode, getPrevNode, getRect, getText, isHeading, queryAll } from './dom-util';

const MW = 10;
const MIN_FS = 14;
const INLINE = 'inline';
const INVALID_DISPLAYS = ['none'];
const headingSelector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

export function getAllHeadings() {
  let allHeadings: HTMLElement[] = queryAll(headingSelector);
  allHeadings = filterByRuleP0(allHeadings);

  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, Styles>();
  for (const node of allHeadings) {
    rectMap.set(node, getRect(node));
    styleMap.set(node, fixHeadingStyle(node));
  }

  allHeadings = filterByStyleRuleP0(allHeadings, styleMap, rectMap);

  return { allHeadings, styleMap, rectMap };
}

function filterByRuleP0(nodes: HTMLElement[]) {
  return nodes.filter((node) => {
    // 必须有文字内容
    if (!getText(node)) return false;

    // 不能是嵌套的heading节点，如h1 h2,h1 b,h2 strong 等
    const nested = !!node.parentElement?.closest(headingSelector);
    return !nested;
  });
}

function filterByStyleRuleP0(nodes: HTMLElement[], styleMap: StyleMap, rectMap: RectMap) {
  return nodes.filter((node) => {
    const rect = rectMap.get(node);
    const style = styleMap.get(node);
    if (!style || !rect) return true;

    // 宽高不小于 10px
    if (Math.min(rect.width, rect.height) < MW) return false;

    // 字号不小于 14px 的
    if (getFontSize(style) < MIN_FS) return false;

    // 不能是隐藏节点、fixed节点
    if (INVALID_DISPLAYS.includes(style.display) || FIXED_POSITIONS.includes(style.position)) return false;

    // 必须独占一行
    return isOneLine(node, style, rect);
  });
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
  if (isHeading(node) || !rect || !style?.display.includes(INLINE)) return true;

  // 文字换行则判定为不是标题
  const lineCount = rect.height / +style.lineHeight.replace(/[^0-9]+$/, '');
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

export type Styles = Omit<
  CSSStyleDeclaration,
  'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'
>;

export type StyleMap = WeakMap<HTMLElement, Styles>;

export type RectMap = WeakMap<HTMLElement, DOMRect>;
