export interface Settings {
  enabled: boolean;
  expanded: boolean;
  theme: string;
  allMatched: boolean;
  whitelist: string;
}

export const THEME_OPTIONS = [
  { label: '默认', value: 'aero' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export const ALL_MATCHED_OPTIONS = [
  { label: '所有', value: true },
  { label: '定制', value: false },
];

export const EXPAND_OPTIONS = [
  { label: '展开', value: true },
  { label: '收起', value: false },
];

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  expanded: true,
  theme: THEME_OPTIONS[0].value,
  allMatched: true,
  whitelist: '**',
};
