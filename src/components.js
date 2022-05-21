import { config } from './config';
import { TocStyles } from './styles';
import { calcHeaderHeight, resetState, state } from './state';
import { addEvent, removeAllEvents } from './events';
import { ANCHOR_SELECTORS, CID, STYLES, SYMBOL } from './constants';

function TocContainer(...htmlList) {
  return `<nav id="${CID}" class="${STYLES.TOC_CONTAINER}">
    <p class="${STYLES.TOC_TITLE}" title="${document.title}">${document.title}</p>
    ${htmlList.join('')}
  </nav>`;
}

function TocBody(anchorNodes) {
  const html =
    anchorNodes
      .map((aNode) => {
        const title = aNode.innerText;

        // level
        const level = +aNode.tagName.replace(/[a-z]/gi, '') - 2;
        const pl = `padding-left:${20 * level}px;`;

        return `<a href="${SYMBOL.HASH}${aNode.id}" style="${pl}" title="${title}">${title}</a>`;
      })
      .join('') || `<p style="text-align: center;color: #ccc;">暂无数据</p>`;

  return `<div class="${STYLES.TOC_BODY}">${html}</div>`;
}

function TocFooter() {
  return `<p class="${STYLES.TOC_FOOTER}"><span>收起</span><span class="${STYLES.HIDDEN}">展开</span></p>`;
}

/**
 * 修改链接样式
 * @param hash
 */
function activeLink(hash) {
  let node = null;
  if (hash) node = state.tocLinkNodes.find((n) => n.href.includes(hash));

  if (!node) {
    const scrollTop = window.scrollY;
    let i = state.anchorsTop.findIndex((top) => scrollTop < top);
    if (i < 0) i = state.anchorsTop.length - 1;
    node = state.tocLinkNodes[i];
  }

  if (!node) return;

  state.tocLinkNodes.forEach((n) => n.classList.remove(STYLES.ACTIVE));
  node.classList.add(STYLES.ACTIVE);
}

/**
 * 1、解决 react官方文档hashchange偶现的DOM定位不准，没有滚动到指定锚点内容区域
 * 2、解决 点击链接跳转到近距离锚点时，定位判断不够精准，出现 toc active状态更新错误
 */
function handleHashChange() {
  addEvent('hashchange', window, () => {
    // 1、解决 react官方文档hashchange偶现的DOM定位不准，没有滚动到指定锚点内容区域，可根据实际情况决定是否需要
    const hash = location.hash.replace(/\?.+$/g, '');
    const heading = document.querySelector(hash);
    if (heading) heading.scrollIntoView();

    // 2、解决 点击链接跳转到近距离锚点时，定位判断不够精准，出现 toc active状态更新错误
    activeLink(hash);
  });
}

/**
 * 监听文档滚动事件，并更新 toc 中链接的激活状态
 * TODO：若出现性能问题，则scroll事件添加节流
 */
function handleScroll() {
  addEvent('scroll', window, activeLink);
}

export function destroyToc() {
  removeAllEvents();

  // remove old toc container
  const oc = document.getElementById(CID);
  if (oc) oc.remove();
}

export function renderToc() {
  destroyToc();
  const url = location.href.replace(/https?:\/\//, '');
  if (config.whiteList.every((w) => !url.startsWith(w))) return;

  let anchorNodes = [];
  const [articleSelectors, headSelectors] = ANCHOR_SELECTORS;
  for (const a of articleSelectors) {
    const selector = headSelectors.map((h) => `${a} ${h}`).join(SYMBOL.COMMA);
    anchorNodes = [...document.querySelectorAll(selector)];
    if (anchorNodes.length) break;
  }

  anchorNodes.forEach((n, i) => (n.id = n.id || `toc-heading-${i}`));

  const headerHeight = calcHeaderHeight();
  const html = TocContainer(TocStyles(headerHeight), TocBody(anchorNodes), TocFooter());
  document.body.insertAdjacentHTML('beforeend', html);

  const container = document.body.lastElementChild;
  const tocBodyNode = container.querySelector(`.${STYLES.TOC_BODY}`);
  const tocLinkNodes = [...tocBodyNode.children];
  resetState(headerHeight, anchorNodes, tocLinkNodes);
  activeLink();

  const footerNode = container.lastElementChild;
  addEvent('click', footerNode, () => {
    [tocBodyNode, ...footerNode.children].forEach((n) => {
      n.classList.toggle(STYLES.HIDDEN);
    });
  });

  handleHashChange();
  handleScroll();
}
