import { FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL } from '../shared/constants';

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

export function getFontSize(style: Pick<CSSStyleDeclaration, 'fontSize'>) {
  return +style.fontSize.replace(/[a-z]/gi, '') || 0;
}

export function getLineHeight(style: Pick<CSSStyleDeclaration, 'lineHeight'>) {
  return +style.lineHeight.replace(/[a-z]/gi, '') || 0;
}

// 获取视觉上的前一个节点，且文本内容不为空
export function getPrevTextNode(node: HTMLElement) {
  while (node && node !== document.body) {
    if (node.previousSibling?.textContent) return node.previousSibling;
    node = (node.previousSibling || node.parentElement) as HTMLElement;
  }

  return null;
}

// 获取视觉上的下一个节点，且文本内容不为空
export function getNextTextNode(node: HTMLElement) {
  while (node && node !== document.body) {
    if (node.nextSibling?.textContent) return node.nextSibling;
    node = (node.nextSibling || node.parentElement) as HTMLElement;
  }

  return null;
}

// 查找符合条件的祖先节点(包括自身)
export function findAncestor(node: HTMLElement, judge: (n: HTMLElement) => boolean) {
  while (node && node !== document.body) {
    if (judge(node)) return node;
    node = node.parentElement as HTMLElement;
  }

  return null;
}

// 查找符合条件的祖先节点集合(包括自身)
export function findAncestors(node: HTMLElement, judge: (n: HTMLElement) => boolean) {
  const nodes: HTMLElement[] = [];
  while (node && node !== document.body) {
    if (judge(node)) nodes.push(node);
    node = node.parentElement as HTMLElement;
  }

  return nodes;
}

// 查找公共祖先节点
export function findCommonAncestor(nodes: HTMLElement[]) {
  if (nodes.length <= 1) return nodes[0];

  let node = nodes[0];
  while (node) {
    if (nodes.every((c) => node.contains(c))) return node;
    node = node.parentElement as HTMLElement;
  }

  return undefined;
}

export function isHidden(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect, bodyRect: DOMRect) {
  style = style || getComputedStyle(node);
  rect = rect || node.getBoundingClientRect();
  bodyRect = bodyRect || document.body.getBoundingClientRect();

  if (style.display === 'none') return true;

  if (style.visibility === 'hidden' || style.visibility === 'collapse') return true;

  const T = 10;
  if (rect.width < T || rect.height < T) return true;

  // 只能使用左右边界进行判断，目前已知 bodyRect.top 可能一直为0、bodyRect.bottom 可能一直为可视区域高度
  return rect.left >= bodyRect.right || rect.right <= bodyRect.left;
}

export function isFixed(node: HTMLElement, style?: CSSStyleDeclaration) {
  style = style || getComputedStyle(node);

  return FIXED_POSITIONS.includes(style.position);
}

export function genNodePath(node: HTMLElement) {
  const selectors: string[] = [];

  while (node && node !== document.body) {
    node = node.parentElement as HTMLElement;
    const cls = [...node.classList].sort().map((c) => '.' + c);
    selectors.push([node.tagName, ...cls].join(''));
  }

  return selectors.reverse().join('>');
}

export function queryAll(selector: string, parent: HTMLElement = document.body) {
  return [...parent.querySelectorAll(selector)] as HTMLElement[];
}

export function genIdClsSelector(words: string[]) {
  return words.map((v) => `[id*=${v}]${SYMBOL.COMMA}[class*=${v}]`).join(SYMBOL.COMMA);
}
