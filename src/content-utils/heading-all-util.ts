import { BOLD_SELECTORS, DISPLAY, HEADING_SELECTORS, NODE_NAME, SYMBOL } from '../shared/constants';
import {
  findAncestor,
  getNextTextNode,
  getPrevTextNode,
  getRect,
  getText,
  isFixed,
  isHeading,
  isHidden,
  pxToNumber,
  queryAll,
} from './dom-util';
import { ResolveRule } from '../shared/resolve-rules';

// b/strong
const boldTagSelector = BOLD_SELECTORS.join(SYMBOL.COMMA);

function getHeadingsByResolveRules(resolveRule?: ResolveRule) {
  if (!resolveRule?.headings?.length) return [];
  const selector = resolveRule?.headings.join(',');

  return queryAll(selector) || [];
}

// TODO: 优先级 h1#id > article h1 > h1 > article b,strong > b,strong > style: bold、fs>=20 > 语义
export function getAllHeadings(articleNode: HTMLElement, resolveRule?: ResolveRule) {
  const hTagHeadings: HTMLElement[] = [];
  const bTagHeadings: HTMLElement[] = [];
  const styleHeadings: HTMLElement[] = [];
  const semanticHeadings: HTMLElement[] = [];
  const oneLineHeadings: HTMLElement[] = [];
  const ruleHeadings: HTMLElement[] = getHeadingsByResolveRules(resolveRule) || [];

  if (ruleHeadings.length) {
    return { hTagHeadings, bTagHeadings, styleHeadings, semanticHeadings, oneLineHeadings, ruleHeadings };
  }

  const bodyRect = document.body.getBoundingClientRect();
  const reg = /^([一二三四五六七八九十百千万零]{1,4}|\d{1,3}|[a-z])[、.·,，].+/i;
  const oneLineReg = /[^、.。·,，!！?？]$/i;

  const walker = document.createTreeWalker(articleNode, NodeFilter.SHOW_ELEMENT);
  let node = walker.root as HTMLElement;

  while ((node = walker.nextNode() as HTMLElement)) {
    const rect = getRect(node);
    const style = getComputedStyle(node);
    if (!isFitRuleP0(node, style, rect, bodyRect)) continue;

    if (isHeading(node)) {
      hTagHeadings.push(node);
    } else {
      // 非h1~h6的节点必须保证独占一行 (isFitRuleP0函数已包含该逻辑，此处不再单独判断)
      if (node.matches(boldTagSelector)) bTagHeadings.push(node);

      // 样式匹配，样式是加粗或居中对齐
      const styleFit = +style.fontWeight >= 500 || pxToNumber(style.fontSize) >= 20;
      if (styleFit) styleHeadings.push(node);

      // 语义匹配，文本开头是序号
      const text = getText(node);
      if (reg.test(text)) semanticHeadings.push(node);

      // 单行文本
      if (oneLineReg.test(text)) oneLineHeadings.push(node);
    }
  }

  return { hTagHeadings, bTagHeadings, styleHeadings, semanticHeadings, oneLineHeadings, ruleHeadings };
}

export function genStyleInfo(headings: HTMLElement[]) {
  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, CSSStyleDeclaration>();

  for (const node of headings) {
    if (!rectMap.has(node)) rectMap.set(node, resolveHeadingRect(node));
    if (!styleMap.has(node)) styleMap.set(node, resolveHeadingStyle(node));
  }

  return { styleMap, rectMap };
}

const invalidTags = [NODE_NAME.svg, NODE_NAME.figure];
const headingSelector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

function isFitRuleP0(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect, bodyRect: DOMRect) {
  // 必须有文字内容
  if (!getText(node)) return false;

  // warning: 不再限制字号（存在字号较小的标题 https://www.mdpi.com/2075-1729/13/7/1425）

  // 不能是隐藏节点
  if (isHidden(node, style, rect, bodyRect)) return false;

  // 不能是 fixed 节点
  if (isFixed(node, style)) return false;

  // 不能是评论内容
  if (isNoiseNode(node)) return false;

  // 不能是嵌套的heading节点，如h1 h2,h1 b,h2 strong 等
  if (node.parentElement?.closest(headingSelector)) return false;

  // 不能是特殊标签节点
  const tagName = node.tagName.toLowerCase();
  if (invalidTags.includes(tagName)) return false;

  // 必须独占一行
  return isUniqueInOneLine(node, style, rect);
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
function isUniqueInOneLine(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect) {
  if (isHeading(node)) return true;

  // 文字换行则判定为不是标题
  if (hasMultiline(node, style)) return false;

  const prevNode = getPrevTextNode(node);
  const nextNode = getNextTextNode(node);

  const y1 = prevNode ? getRect(prevNode).bottom : -Infinity;
  const y2 = nextNode ? getRect(nextNode).top : Infinity;

  const prevText = prevNode?.textContent || '';
  const nextText = nextNode?.textContent || '';

  // 前后节点与当前节点不在同一行
  return (y1 <= rect.top || /[\r\n]\s*$/.test(prevText)) && (rect.bottom <= y2 || /^\s*[\r\n]/.test(nextText));
}

// 借助 Range.getClientRects 判断是否多行
// 使用高度除以行高、字号判断是否多行存在bug，会出现误判
function hasMultiline(node: HTMLElement, style: CSSStyleDeclaration) {
  const range = new Range();
  // 如下设置range起止位置，可以最大程度保证首尾rect的y值与实际首尾节点一致
  // 若仍存在问题，可考虑使用最大最小y值求差值进行判断
  range.setStart(node, 0);
  range.setEndAfter(node);

  const rects = range.getClientRects();
  if (rects.length < 2) return false;

  const fontsize = pxToNumber(style.fontSize);
  return Math.abs(rects[rects.length - 1].y - rects[0].y) >= fontsize;
}

export type StyleMap = WeakMap<HTMLElement, CSSStyleDeclaration>;

export type RectMap = WeakMap<HTMLElement, DOMRect>;
