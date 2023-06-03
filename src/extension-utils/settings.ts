import { loadStorage, saveStorage } from './api';

export interface Settings {
  position: string;
  theme: string;
  // 已读版本号，用于判断是否已经查看releaseNote
  knownVersion: string;
}

export const THEME_OPTIONS = [
  { label: '默认', value: 'aero' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export const POS_EMBED = 'embed';

export const POSITION_OPTIONS = [
  { label: '浮动', value: 'fixed' },
  { label: '内嵌', value: POS_EMBED },
];

export const DEFAULT_SETTINGS: Settings = {
  position: POSITION_OPTIONS[0].value,
  theme: THEME_OPTIONS[0].value,
  knownVersion: '',
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);
export const SETTINGS_KEYMAP = {
  ...DEFAULT_SETTINGS,
  ...Object.fromEntries(SETTINGS_KEYS.map((s) => [s, s])),
};

export function loadSettings() {
  return loadStorage(SETTINGS_KEYS) as Promise<Settings>;
}

export function saveSettings(settings: Settings) {
  return saveStorage(settings) as Promise<void>;
}
