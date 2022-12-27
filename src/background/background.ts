/* eslint-disable */
import { DEFAULT_SETTINGS } from '../shared/settings';
import { MSG_NAMES } from '../shared/constants';

// 安装时保存默认配置
chrome.runtime.onInstalled.addListener((details: { reason: string }) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return;
  chrome.storage.local.set(DEFAULT_SETTINGS).then();
});

// 监听快捷键指令事件
chrome.commands.onCommand.addListener(async (name: string, tab: Tab) => {
  if (!tab?.id) tab = await getCurrentTab();
  if (name === MSG_NAMES.TOGGLE_TOC) sendToggleMsg(tab);
});

// 监听插件按钮点击事件
chrome.action.onClicked.addListener(async (tab: Tab) => {
  if (!tab?.id) tab = await getCurrentTab();
  sendToggleMsg(tab);
});

function sendToggleMsg(tab: Tab) {
  chrome.tabs.sendMessage(tab.id, { name: MSG_NAMES.TOGGLE_TOC });
}

async function getCurrentTab() {
  const opt = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(opt);
  return tab;
}

interface Tab {
  id: number;
  url: string;
  title: string;
}
