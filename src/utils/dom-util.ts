import { HEADING_SELECTORS, SYMBOL } from '../shared/constants';

export function getText(node: Pick<Node, 'textContent'> | null) {
  return (node?.textContent || '').trim();
}

export function getRect(node: HTMLElement | Node) {
  if (!node) return new DOMRect();
  if ((node as HTMLElement).getBoundingClientRect) return (node as HTMLElement).getBoundingClientRect();

  const range = new Range();
  range.selectNode(node);
  return range.getBoundingClientRect();
}

export function getLevel(node: HTMLElement) {
  return +(node.tagName.replace(/[a-z]/gi, '') || HEADING_SELECTORS.length + 1) - 1;
}

const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
export function isHeading(node: HTMLElement) {
  return node.matches(headSelector);
}

export function getFontSize(style: CSSStyleDeclaration) {
  return +style.fontSize.replace(/[a-z]/gi, '') || 0;
}

// 获取视觉上的前一个节点
export function getPrevNode(node: HTMLElement) {
  while (node && node !== document.body) {
    if (node.previousSibling) return node.previousSibling;
    node = node.parentElement as HTMLElement;
  }

  return null;
}

// 获取视觉上的下一个节点
export function getNextNode(node: HTMLElement) {
  while (node && node !== document.body) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentElement as HTMLElement;
  }

  return null;
}

// 查找符合条件的祖先节点
export function findAncestor(node: HTMLElement, judge: (n: HTMLElement) => boolean) {
  while (node && node !== document.body) {
    node = node.parentElement as HTMLElement;
    if (judge(node)) return node;
  }

  return null;
}

export function getDepthAndPath(node: HTMLElement) {
  const selectors = [];

  while (node && node !== document.body) {
    node = node.parentElement as HTMLElement;
    const cls = [...node.classList].sort().map((c) => '.' + c);
    selectors.push([node.tagName, ...cls].join(''));
  }

  return [selectors.length, selectors.reverse().join('>')];
}
