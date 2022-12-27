import * as BrowserStorage from '../utils/browser-storage';

export interface Settings {
  enabled: boolean;
  position: string;
  theme: string;
  allMatched: boolean;
  whitelist: string;
}

export const THEME_OPTIONS = [
  { label: '默认', value: 'aero' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export const POS_FIXED = 'fixed';

export const POSITION_OPTIONS = [
  { label: '浮动', value: POS_FIXED },
  { label: '内嵌', value: 'embed' },
];

export const ALL_MATCHED_OPTIONS = [
  { label: '所有', value: true },
  { label: '定制', value: false },
];

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  position: POSITION_OPTIONS[0].value,
  theme: THEME_OPTIONS[0].value,
  allMatched: true,
  whitelist: '**',
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);

export function getSettings() {
  return BrowserStorage.get(SETTINGS_KEYS);
}
