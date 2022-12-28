import * as BrowserStorage from '../utils/browser-storage';

export interface Settings {
  position: string;
  theme: string;
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

export const DEFAULT_SETTINGS: Settings = {
  position: POSITION_OPTIONS[0].value,
  theme: THEME_OPTIONS[0].value,
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);
export const SETTINGS_KEYMAP = {
  ...DEFAULT_SETTINGS,
  ...Object.fromEntries(SETTINGS_KEYS.map((s) => [s, s])),
};

export function loadSettings() {
  return BrowserStorage.get(SETTINGS_KEYS);
}

export function saveSettings(settings: Settings) {
  return BrowserStorage.set(settings);
}
