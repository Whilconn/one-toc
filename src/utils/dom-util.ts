import { HEADING_SELECTORS, SYMBOL } from '../shared/constants';

export function getText(node: Pick<Node, 'textContent'> | null) {
  return (node?.textContent || '').trim();
}

export function getRect(node: HTMLElement) {
  return node.getBoundingClientRect ? node.getBoundingClientRect() : new DOMRect();
}

export function getLevel(node: HTMLElement) {
  return +(node.tagName.replace(/[a-z]/gi, '') || HEADING_SELECTORS.length + 1) - 1;
}

export function genPathSelector(node: HTMLElement) {
  if (!node) return '';

  const selectors = [];

  while ((node = node.parentElement as HTMLElement)) {
    const cls = [...node.classList].map((c) => '.' + c);
    selectors.push([node.tagName, ...cls].join(''));
  }

  return selectors.reverse().join('>');
}

const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
export function isHeading(node: HTMLElement) {
  return node.matches(headSelector);
}

export function getFontSize(style: CSSStyleDeclaration) {
  return +style.fontSize.replace(/[^0-9]/g, '') || 0;
}
