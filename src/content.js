/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Constants >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
const CID = 'rdc-1652755589611';
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
            box-shadow: 0 1px 2px 0 #ccc;
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
  }).join('') || `<p style="text-align: center;color: #ccc;">暂无数据</p>`;

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

  if (!node) return;

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

/**
 * 【trick】双击文章标题时加载并拷贝markdown内容，可按需移除
 */
function copyMdWhenClickHeader() {
  function showMsg(errMsg = '') {
    const node = document.createElement('p');
    node.innerText = errMsg ? '❌ ' + errMsg : '✅ 复制成功';
    node.style.cssText = 'position:fixed;padding:10px 40px;bottom:20px;right:20px;background:#fff;font-size:14px;color:#000000d9;border-radius:2px;z-index:9999;box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;';
    document.body.append(node);
    setTimeout(() => node.remove(), 3000);
  }

  document.body.addEventListener('dblclick', (event) => {
    if (event.target.tagName !== 'H1') return;

    const name = location.href.replace(/^.+\/|\.html.*$/g, '');
    const link = `https://raw.githubusercontent.com/reactjs/zh-hans.reactjs.org/main/content/docs/${name}.md`;

    const ctrl = new AbortController(), SECONDS = 5;
    const tid = setTimeout(() => ctrl.abort(), SECONDS * 1000);

    fetch(link, {signal: ctrl.signal}).
        then(res => res.ok && res.text()).
        then(text => {
          clearTimeout(tid);
          text = text.replace(/^---\n[\s\S]+?---\n+|\{#[^}]+}/g, '');
          text = text.replace(/\n##/g, '\n#');

          navigator.clipboard.writeText(text).
              then(() => showMsg()).
              catch(e => showMsg(e.message));
        }).
        catch(e => showMsg(ctrl.signal.aborted ? '请求超时' : e.message));
  });
}

/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Main Entrance >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/
function start() {
  renderToc();

  const target = document.querySelector('title');
  const observer = new MutationObserver(() => renderToc());
  observer.observe(target, {childList: true});

  observeHashChange();
  observeScroll();
  copyMdWhenClickHeader();
}

start();
