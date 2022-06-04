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
  ].join('\n'),
};
