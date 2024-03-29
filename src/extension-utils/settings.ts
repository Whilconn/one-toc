import { loadStorage, saveStorage } from './api';
import { RESOLVE_RULES, RESOLVE_RULES_VERSION, ResolveRule } from '../shared/resolve-rules';

export interface Settings {
  position: string;
  theme: string;
  strategy: string;
  autoOpenRules: string;
  // 已读版本号，用于判断是否已经查看releaseNote
  knownVersion: string;
  resolveRules: ResolveRule[];
  resolveRulesVersion: string;
}

export const THEME_OPTIONS = [
  { label: '默认', value: 'aero' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export const POS_EMBED = 'embed';

export const POSITION_OPTIONS = [
  { label: '右浮动', value: 'fixed-right' },
  { label: '左浮动', value: 'fixed-left' },
  { label: '内嵌', value: POS_EMBED },
];

export const STRATEGY_OPTIONS = [
  { label: '自带', value: 'official' },
  { label: '精选', value: 'inferred' },
];

export const DEFAULT_SETTINGS: Settings = {
  position: POSITION_OPTIONS[0].value,
  theme: THEME_OPTIONS[0].value,
  strategy: STRATEGY_OPTIONS[0].value,
  autoOpenRules: import.meta.env.DEV ? '**' : '',
  knownVersion: '',
  resolveRules: RESOLVE_RULES,
  resolveRulesVersion: RESOLVE_RULES_VERSION,
};

export const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);
export const SETTINGS_KEYMAP = {
  ...Object.fromEntries(SETTINGS_KEYS.map((s) => [s, s])),
} as Record<keyof Settings, string>;

export function loadSettings() {
  return loadStorage(SETTINGS_KEYS) as Promise<Settings>;
}

export function saveSettings(settings: Partial<Settings>) {
  return saveStorage(settings) as Promise<void>;
}
