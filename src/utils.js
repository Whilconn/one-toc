import { ANCHOR_SELECTORS, HEADER_HEIGHT, SYMBOL } from './constants';

export function getHeaderHeight() {
  const tag = 'header';
  const reg = new RegExp(tag, 'i');
  const nodes = document.elementsFromPoint(0, 30);

  const header = nodes.find((node) => {
    return node.tagName.toLowerCase() === tag || reg.test(node.className || '');
  });

  return 20 + Math.min(header ? header.scrollHeight : HEADER_HEIGHT, 2 * HEADER_HEIGHT);
}

export function getAnchors() {
  let nodes = [];
  const [articleSelectors, headSelectors] = ANCHOR_SELECTORS;
  for (const a of articleSelectors) {
    const selector = headSelectors.map((h) => `${a} ${h}`).join(SYMBOL.COMMA);
    nodes = [...document.querySelectorAll(selector)];
    if (nodes.length) break;
  }

  nodes.forEach((n, i) => (n.id = n.id || `toc-heading-${i}`));

  return nodes;
}

export function getAnchorTopList(anchorNodes, marginTop) {
  const scrollY = window.scrollY;

  return anchorNodes.map((n, i) => {
    if (i >= anchorNodes.length - 1) return Infinity;
    return scrollY + anchorNodes[i + 1].getBoundingClientRect().top - marginTop;
  });
}
