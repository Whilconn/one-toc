export interface Settings {
  enabled: boolean;
  expanded: boolean;
  whitelist: string;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  expanded: true,
  whitelist: [
    '*reactjs.org/(docs|blog)/**',
    '*zhihu.com/p/**',
    '*jianshu.com/p/**',
    '*oschina.net/**',
    '*cnblogs.com/**',
    '*csdn.net/**',
    '*github.com/*/**',
    '*eslint.(org|cn)/docs/**',
    '*blog.51cto.com/**',
    '*www.ncbi.nlm.nih.gov/**',
  ].join('\n'),
};
