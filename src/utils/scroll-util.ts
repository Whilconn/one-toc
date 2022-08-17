/**
 * 提取滚动节点
 */
export function getScrollingNode(): HTMLElement {
  const se = document.scrollingElement;
  if (se?.scrollTop) return se as HTMLElement;

  const SCROLL_ATTRS = ['auto', 'scroll', 'overlay'];

  let node = document.activeElement;
  while (node) {
    if (node.scrollTop) break;

    const style = window.getComputedStyle(node);
    if (SCROLL_ATTRS.includes(style.overflowY) && node.scrollHeight > node.clientHeight) break;

    node = node.parentElement;
  }

  if (node === document.body) node = null;

  return (node || se || document.documentElement || document.body) as HTMLElement;
}

/**
 * 使用 scroll api 进行滚动
 * @param headingNode
 * @param fixedHeaderHeight
 */
export function scrollByApi(headingNode: HTMLElement, fixedHeaderHeight: number) {
  const scrollingNode = getScrollingNode();
  scrollingNode.style.scrollBehavior = 'auto';

  headingNode.style.scrollMarginTop = '0';
  headingNode.style.scrollPaddingTop = '0';

  headingNode.scrollIntoView({ block: 'start' });
  scrollingNode.scrollBy(0, -fixedHeaderHeight);
  markCurrentHeading(headingNode);
}

/**
 * 借助 hashchange 进行滚动
 * @param headingNode
 * @param fixedHeaderHeight
 */
export function scrollByHash(headingNode: HTMLElement, fixedHeaderHeight: number) {
  const scrollingNode = getScrollingNode();
  scrollingNode.style.scrollBehavior = 'auto';

  // 解决 fixed header 遮挡锚点的问题
  headingNode.style.scrollMarginTop = `${fixedHeaderHeight}px`;
  headingNode.style.scrollPaddingTop = `${fixedHeaderHeight}px`;

  window.location.hash = headingNode.id;
  // scrollingNode.scrollBy(0, -fixedHeaderHeight);
  markCurrentHeading(headingNode);
}

function markCurrentHeading(headingNode: HTMLElement) {
  const newStyle = '0 2px 0 #007fff';
  if (headingNode.style.boxShadow === newStyle) return;

  const oldStyle = headingNode.style.boxShadow;
  headingNode.style.boxShadow = newStyle;

  setTimeout(() => {
    headingNode.style.boxShadow = oldStyle;
  }, 2e3);
}
