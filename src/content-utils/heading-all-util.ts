import { BOLD_SELECTORS, DISPLAY, HEADING_SELECTORS, SYMBOL } from '../shared/constants';
import { resolveArticle } from './article-util';
import {
  findAncestor,
  getFontSize,
  getLineHeight,
  getNextNode,
  getPrevNode,
  getRect,
  getText,
  isFixed,
  isHeading,
  isHidden,
} from './dom-util';

const MIN_FS = 14;

// h1-h6
const tagHeadingSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
// b/strong
const boldHeadingSelector = BOLD_SELECTORS.join(SYMBOL.COMMA);

// TODO: 优先级 h1#id > article h1 > h1 > article b,strong > b,strong > style: bold、fs>=20 > 语义
export function getAllHeadings() {
  const articleNode = resolveArticle();

  const hTagHeadings: HTMLElement[] = [];
  const bTagHeadings: HTMLElement[] = [];
  const styleHeadings: HTMLElement[] = [];
  const semanticHeadings: HTMLElement[] = [];

  const bodyRect = document.body.getBoundingClientRect();
  const reg = /^([一二三四五六七八九十百千万零]{1,4}|\d{1,3}|[a-z])[、.·,，].+/i;

  const walker = document.createTreeWalker(articleNode, NodeFilter.SHOW_ELEMENT);
  let node = walker.root as HTMLElement;

  while ((node = walker.nextNode() as HTMLElement)) {
    const rect = getRect(node);
    const style = getComputedStyle(node);
    if (!isFitRuleP0(node, style, rect, bodyRect)) continue;

    if (node.matches(tagHeadingSelector)) {
      hTagHeadings.push(node);
    } else if (getLineCount(node, style, rect) === 1) {
      if (node.matches(boldHeadingSelector)) bTagHeadings.push(node);

      // 样式匹配，样式是加粗或居中对齐
      const styleFit = +style.fontWeight >= 500 || getFontSize(style) >= 20;
      if (styleFit) styleHeadings.push(node);

      // 语义匹配，文本开头是序号
      const text = getText(node);
      if (reg.test(text)) semanticHeadings.push(node);
    }
  }

  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, CSSStyleDeclaration>();
  const headings = [...hTagHeadings, ...bTagHeadings, ...styleHeadings, ...semanticHeadings];
  for (const node of headings) {
    if (!rectMap.has(node)) rectMap.set(node, resolveHeadingRect(node));
    if (!styleMap.has(node)) styleMap.set(node, resolveHeadingStyle(node));
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

const headingSelector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

function isFitRuleP0(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect, bodyRect: DOMRect) {
  // 必须有文字内容
  if (!getText(node)) return false;

  // 字号不小于 14px 的
  if (getFontSize(style) < MIN_FS) return false;

  // 不能是隐藏节点
  if (isHidden(node, style, rect, bodyRect)) return false;

  // 不能是 fixed 节点
  if (isFixed(node, style)) return false;

  // 不能是评论内容
  if (isNoiseNode(node)) return false;

  // 不能是嵌套的heading节点，如h1 h2,h1 b,h2 strong 等
  if (node.parentElement?.closest(headingSelector)) return false;

  // 必须独占一行
  return isOneLine(node, style, rect);
}

function isNoiseNode(node: HTMLElement) {
  const selector = 'header,aside,footer,nav,.recommend,#recommend';
  return !!node.closest(selector);
}

// 修正 heading 的字体、字号、颜色等样式（不直接修改节点样式，会导致页面布局改变甚至破坏）
function resolveHeadingStyle(node: HTMLElement) {
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

// 修正布局信息（不直接修改节点样式，会导致页面布局改变甚至破坏）
function resolveHeadingRect(node: HTMLElement) {
  const rect = getRect(node);

  const ancestor = findAncestor(node, (n) => {
    return !getComputedStyle(n).display.includes(DISPLAY.inline);
  });

  if (ancestor) {
    const ancestorRect = ancestor.getBoundingClientRect();
    rect.x = ancestorRect.x;
    rect.width = ancestorRect.width;
  }

  return rect;
}

// 非 h1~h6 的节点，必须独占一行
function isOneLine(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect) {
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

function getLineCount(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect) {
  return Math.ceil(rect.height / Math.max(getLineHeight(style), getFontSize(style)));
}

export type StyleMap = WeakMap<HTMLElement, CSSStyleDeclaration>;

export type RectMap = WeakMap<HTMLElement, DOMRect>;
