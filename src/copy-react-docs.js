/**
 * 【trick】双击文章标题时加载并拷贝markdown内容，可按需移除
 * 仅用于 React 官方技术文档：https://*.reactjs.org/
 */
export function copyMdWhenClickHeader() {
  if (!/.*reactjs\.org$/.test(location.host)) return;

  function showMsg(errMsg = '') {
    const node = document.createElement('p');
    node.innerText = errMsg ? '❌ ' + errMsg : '✅ 复制成功';
    node.style.cssText =
      'position:fixed;padding:10px 40px;bottom:20px;right:20px;background:#fff;font-size:14px;color:#000000d9;border-radius:2px;z-index:9999;box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;';
    document.body.append(node);
    setTimeout(() => node.remove(), 3000);
  }

  document.body.addEventListener('dblclick', (event) => {
    if (event.target.tagName !== 'H1') return;

    const name = location.href.replace(/^.+\/|\.html.*$/g, '');
    const link = `https://raw.githubusercontent.com/reactjs/zh-hans.reactjs.org/main/content/docs/${name}.md`;

    const ctrl = new AbortController(),
      SECONDS = 5;
    const tid = setTimeout(() => ctrl.abort(), SECONDS * 1000);

    fetch(link, { signal: ctrl.signal })
      .then((res) => res.ok && res.text())
      .then((text) => {
        clearTimeout(tid);
        text = text.replace(/^---\n[\s\S]+?---\n+|\{#[^}]+}/g, '');
        text = text.replace(/\n##/g, '\n#');

        navigator.clipboard
          .writeText(text)
          .then(() => showMsg())
          .catch((e) => showMsg(e.message));
      })
      .catch((e) => showMsg(ctrl.signal.aborted ? '请求超时' : e.message));
  });
}
