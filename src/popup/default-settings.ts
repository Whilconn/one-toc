export interface Settings {
  enabled: boolean;
  expanded: boolean;
  theme: string;
  enableGlob: boolean;
  whitelist: string;
}

export const THEME_OPTIONS = [
  { label: '默认', value: 'aero' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  expanded: true,
  theme: THEME_OPTIONS[0].value,
  enableGlob: true,
  whitelist: import.meta.env.DEV
    ? '**'
    : [
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
