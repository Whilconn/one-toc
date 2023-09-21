import { MSG_NAMES } from '../shared/constants';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  POSITION_OPTIONS,
  saveSettings,
  Settings,
  STRATEGY_OPTIONS,
  THEME_OPTIONS,
} from '../extension-utils/settings';
import {
  addClickActionListener,
  addCommandListener,
  addInstalledListener,
  INSTALL_REASON,
  sendTabMessage,
  Tab,
  UPDATE_REASON,
} from '../extension-utils/api';

// 将变更的配置项重置为默认值，仅用于插件更新的场景
// 当配置项的选项值发生变化，原来的值在现有备选项中不存在，则将该配置项重置为默认的选项值
function fixSettings(st: Settings) {
  if (!st) return st;

  const optionsMap: Partial<Record<keyof Settings, Option[]>> = {
    position: POSITION_OPTIONS,
    theme: THEME_OPTIONS,
    strategy: STRATEGY_OPTIONS,
  };

  const settings = { ...st };

  for (const key of Object.keys(optionsMap) as Array<keyof Settings>) {
    if (optionsMap[key]?.find((o) => o.value === st[key])) continue;
    settings[key] = DEFAULT_SETTINGS[key];
  }

  return settings;
}

// 监听安装、更新等事件
addInstalledListener((details: { reason: string }) => {
  if (details.reason === INSTALL_REASON) {
    // 安装时保存默认配置
    void saveSettings(DEFAULT_SETTINGS).then();
  } else if (details.reason === UPDATE_REASON) {
    // 更新时将变更的配置项重置为默认值
    void loadSettings().then((st) => {
      const fst = fixSettings(st);
      void saveSettings(fst).then();
    });
  }
});

// 监听快捷键指令事件
addCommandListener((name: string, tab: Tab) => {
  if (name === MSG_NAMES.TOGGLE_TOC) sendTabMessage(tab, MSG_NAMES.TOGGLE_TOC);
});

// 监听插件按钮点击事件
addClickActionListener((tab: Tab) => {
  sendTabMessage(tab, MSG_NAMES.TOGGLE_TOC);
});

type Option = { label: string; value: string };
