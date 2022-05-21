import { HEADER_HEIGHT } from './constants';

export const state = {
  headerHeight: HEADER_HEIGHT,
  anchorNodes: [],
  tocLinkNodes: [],
  anchorsTop: [],
};

export function calcHeaderHeight() {
  const tag = 'header';
  const reg = new RegExp(tag, 'i');
  const nodes = document.elementsFromPoint(0, 30);

  const header = nodes.find((node) => {
    return node.tagName.toLowerCase() === tag || reg.test(node.className || '');
  });

  return 20 + Math.min(header ? header.scrollHeight : HEADER_HEIGHT, 2 * HEADER_HEIGHT);
}

export function resetState(headerHeight, anchorNodes, tocLinkNodes) {
  const top = window.scrollY;
  headerHeight = headerHeight || calcHeaderHeight();

  const anchorsTop = anchorNodes.map((n, i) => {
    if (i >= anchorNodes.length - 1) return Infinity;
    return top + anchorNodes[i + 1].getBoundingClientRect().top - headerHeight;
  });

  Object.assign(state, { headerHeight, anchorNodes, tocLinkNodes, anchorsTop });
}
