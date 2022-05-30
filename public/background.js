const defaultSettings = {
  enabled: true,
  whitelist: [
    'reactjs.org/docs',
    'reactjs.org/blog',
    'zh-hans.reactjs.org/docs',
    'zh-hans.reactjs.org/blog',
    'zhuanlan.zhihu.com/p',
    'www.jianshu.com/p',
    'my.oschina.net/u',
    'www.cnblogs.com/',
    'blog.csdn.net/',
    'blog.51cto.com/',
    'github.com/',
    'eslint.cn/docs',
  ].join('\n'),
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return;
  chrome.storage.local.set(defaultSettings).then();
});
