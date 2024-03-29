import { FIXED_POSITIONS } from '../shared/constants';
import { queryAll } from './dom-util';

const EMBED_MOD = 'onetoc-embed-mod';
const TOC_WIDTH = 300;

function getFixedNodes(left: number) {
  const nodes = queryAll('*');
  const fixedNodes: Array<[HTMLElement, Array<{ name: string; origin: string; target: string }>]> = [];

  for (const n of nodes) {
    const rect = n.getBoundingClientRect();
    const s = getComputedStyle(n);

    // 根据 clientRect、computedStyle 判定 fixed
    if (rect.width * rect.height && rect.left < left && FIXED_POSITIONS.includes(s.position)) {
      if (fixedNodes.some(([fn]) => fn.contains(n))) continue;
      const attrs = [
        {
          name: 'left',
          origin: n.style.left,
          target: `calc(${rect.left}px + var(--onetoc-width))`,
        },
        {
          name: 'maxWidth',
          origin: n.style.maxWidth,
          target: 'calc(100vw - var(--onetoc-width))',
        },
      ];
      fixedNodes.push([n, attrs]);
    }
  }

  return fixedNodes;
}

export function changeLayout() {
  document.body.toggleAttribute(EMBED_MOD, true);

  const fixedNodes = getFixedNodes(TOC_WIDTH);
  fixedNodes.forEach(([n, attrs]) => {
    attrs.forEach((a) => n.style.setProperty(a.name, a.target));
  });

  return function restoreLayout() {
    document.body.toggleAttribute(EMBED_MOD, false);

    fixedNodes.forEach(([n, attrs]) => {
      attrs.forEach((a) => n.style.setProperty(a.name, a.origin));
    });
  };
}
