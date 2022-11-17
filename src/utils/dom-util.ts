export function getText(node: HTMLElement) {
  return (node.textContent || '').trim();
}

export function getRect(node: HTMLElement) {
  return node.getBoundingClientRect ? node.getBoundingClientRect() : new DOMRect();
}

export function getLevel(node: HTMLElement) {
  return +node.tagName.replace(/[a-z]/gi, '') || 7;
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
