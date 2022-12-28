import { DEFAULT_SETTINGS, saveSettings } from '../extension-utils/settings';
import { MSG_NAMES } from '../shared/constants';
import {
  addClickActionListener,
  addCommandListener,
  addInstalledListener,
  INSTALL_REASON,
  sendTabMessage,
  Tab,
} from '../extension-utils/api';

// 安装时保存默认配置
addInstalledListener((details: { reason: string }) => {
  if (details.reason !== INSTALL_REASON) return;
  void saveSettings(DEFAULT_SETTINGS).then();
});

// 监听快捷键指令事件
addCommandListener((name: string, tab: Tab) => {
  if (name === MSG_NAMES.TOGGLE_TOC) sendTabMessage(tab, MSG_NAMES.TOGGLE_TOC);
});

// 监听插件按钮点击事件
addClickActionListener((tab: Tab) => {
  sendTabMessage(tab, MSG_NAMES.TOGGLE_TOC);
});
