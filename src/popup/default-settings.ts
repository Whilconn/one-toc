export const SETTINGS_KEYS = {
  ENABLED: 'enabled',
  WHITELIST: 'whitelist',
};

export interface Settings {
  enabled?: boolean;
  whitelist?: string;
}

export const DEFAULT_SETTINGS = {
  enabled: true,
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
