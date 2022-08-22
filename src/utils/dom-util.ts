export function getText(node: HTMLElement) {
  return (node.textContent || '').trim();
}
