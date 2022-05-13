/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Constants >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
const CID = 'rc-v20220509';
const ANCHOR_SELECTOR = 'h2,h3';
const STYLES = {
  RDC_CONTAINER: 'rdc-container',
  RDC_TITLE: 'rdc-title',
  RDC_BODY: 'rdc-body',
  RDC_FOOTER: 'rdc-footer',
  ACTIVE: 'active',
  HIDDEN: 'hidden',
};
const SYMBOL = {HASH: '#'};

/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Styles >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
function TocStyles() {
  const header = document.querySelector('header');
  const top = header ? header.scrollHeight + 20 : 80;

  const ellipsis = `text-overflow: ellipsis;overflow: hidden;white-space: nowrap;`;
  return `<style>
        .rdc-container {
            position: fixed;
            width: 260px;
            top: ${top}px;
            right: 20px;
            font-size: 14px;
            border-radius: 5px;
            background: #fff;
        }
        
        .rdc-container .hidden {
            display: none;
        }

        .rdc-title {
            padding: 15px;
            border-bottom: 1px solid #e4e6eb;
            font-weight: bold;
            ${ellipsis}
        }
        
        .rdc-body {
            padding: 15px;
            max-height: calc(100vh - ${top}px - 80px);
            overflow: auto;
        }

        .rdc-body a {
            display: block;
            padding: 8px 0;
            color: #333;
            ${ellipsis}
        }
        
        .rdc-body a:hover {
            color: #007fff;
        }
        
        .rdc-body a.active {
            color: #007fff;
            font-weight: bold;
        }
        
        .rdc-footer {
            padding: 5px;
            text-align: center;
            color: #007fff;
            cursor: pointer;
            border-top: 1px solid #e4e6eb;
        }
    </style>`;
}

/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Renderers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
const data = {
  anchorNodes: [],
  tocLinkNodes: [],
  anchorsTop: [],
};

function resetData(anchorNodes, tocLinkNodes) {
  const top = window.scrollY, OFFSET = 50;
  const anchorsTop = anchorNodes.map((n, i) => {
    if (i >= anchorNodes.length - 1) return Infinity;
    return top + anchorNodes[i + 1].getBoundingClientRect().top - OFFSET;
  });
  Object.assign(data, {anchorNodes, tocLinkNodes, anchorsTop});
}

// remove old toc container
function removeTocContainer() {
  const oc = document.getElementById(CID);
  if (oc) oc.remove();
}

function TocContainer(...htmlList) {
  return `<nav id="${CID}" class="${STYLES.RDC_CONTAINER}">
    <p class="${STYLES.RDC_TITLE}" title="${document.title}">${document.title}</p>
    ${htmlList.join('')}
  </nav>`;
}

function TocBody(anchorNodes) {
  const html = anchorNodes.map(aNode => {
    const title = aNode.innerText;

    // level
    const level = +aNode.tagName.replace(/[a-z]/ig, '') - 2;
    const pl = `padding-left:${20 * level}px;`;

    return `<a href="${SYMBOL.HASH}${aNode.id}" style="${pl}" title="${title}">${title}</a>`;
  }).join('');

  return `<div class="${STYLES.RDC_BODY}">${html}</div>`;
}

function TocFooter() {
  return `<p class="${STYLES.RDC_FOOTER}"><span>收起</span><span class="${STYLES.HIDDEN}">展开</span></p>`;
}

function renderToc() {
  removeTocContainer();
  if (!/^\/(docs|blog)/.test(location.pathname)) return;

  const anchorNodes = [...document.querySelectorAll(ANCHOR_SELECTOR)];
  const html = TocContainer(TocStyles(), TocBody(anchorNodes), TocFooter());
  document.body.insertAdjacentHTML('beforeend', html);

  const container = document.body.lastElementChild;
  const tocBodyNode = container.querySelector(`.${STYLES.RDC_BODY}`);
  const tocLinkNodes = [...tocBodyNode.children];
  resetData(anchorNodes, tocLinkNodes);
  activeLink();

  const footerNode = container.lastElementChild;
  footerNode.addEventListener('click', () => {
    [tocBodyNode, ...footerNode.children].forEach(n => {
      n.classList.toggle(STYLES.HIDDEN);
    });
  });
}

/**
 * 修改链接样式
 * @param hash
 */
function activeLink(hash) {
  let node = null;
  if (hash) node = data.tocLinkNodes.find(n => n.href.includes(hash));

  if (!node) {
    const scrollTop = window.scrollY;
    let i = data.anchorsTop.findIndex(top => scrollTop < top);
    if (i < 0) i = data.anchorsTop.length - 1;
    node = data.tocLinkNodes[i];
  }

  data.tocLinkNodes.forEach(n => n.classList.remove(STYLES.ACTIVE));
  node.classList.add(STYLES.ACTIVE);
}

/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Observers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/

/**
 * 1、解决 react官方文档hashchange偶现的DOM定位不准，没有滚动到指定锚点内容区域
 * 2、解决 点击链接跳转到近距离锚点时，定位判断不够精准，出现 toc active状态更新错误
 */
function observeHashChange() {
  window.addEventListener('hashchange', () => {
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
function observeScroll() {
  window.addEventListener('scroll', () => activeLink());
}

/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Main Entrance >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
function start() {
  renderToc();

  const target = document.querySelector('title');
  const observer = new MutationObserver(() => renderToc());
  observer.observe(target, {childList: true});

  observeHashChange();
  observeScroll();
}

start();

