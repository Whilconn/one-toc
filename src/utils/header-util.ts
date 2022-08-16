import { FIXED_POSITIONS, HEADER_HEIGHT } from '../content/constants';

export function getFixedHeaderHeight() {
  const bottom = locateHeaderBottom();
  return 20 + Math.min(bottom > 0 ? bottom : HEADER_HEIGHT, 2 * HEADER_HEIGHT);
}

function locateHeaderBottom() {
  let startY = 0;
  let headerBottom = -1000;
  const step = 10;
  const endY = Math.min(window.innerHeight / 2, 200);

  while (startY < endY) {
    startY += step;
    const newHeader = detectHeader(startY);

    if (!newHeader) continue;

    const newBottom = newHeader.getBoundingClientRect().bottom;
    if (headerBottom < newBottom) headerBottom = newBottom;
  }

  return headerBottom;
}

function detectHeader(y: number) {
  const nodes = document.elementsFromPoint(window.innerWidth / 2, y) as HTMLElement[];
  return nodes.reverse().find((node) => isFixedHeader(node));
}

function isFixedHeader(node: HTMLElement) {
  if (!node) return false;

  const selector = 'header,.header';
  const style = getComputedStyle(node);

  const isFixed = FIXED_POSITIONS.includes(style.position);
  const isUpper = +style.zIndex > 10;

  const ltHalfHeight = node.scrollHeight < Math.max(window.innerHeight / 2, 200);
  const gtQuarterWidth = node.scrollWidth > Math.min(window.innerWidth / 4, 2000);

  return (node.matches(selector) || isFixed || isUpper) && ltHalfHeight && gtQuarterWidth;
}
