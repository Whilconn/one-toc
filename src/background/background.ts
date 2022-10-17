/* eslint-disable */
import { DEFAULT_SETTINGS } from '../shared/default-settings';
import { MSG_NAMES } from '../shared/constants';

chrome.runtime.onInstalled.addListener((details: { reason: string }) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return;
  chrome.storage.local.set(DEFAULT_SETTINGS).then();
});

chrome.commands.onCommand.addListener(async (name: string) => {
  const tab = await getCurrentTab();
  if (name === MSG_NAMES.TOGGLE_TOC) chrome.tabs.sendMessage(tab.id, { name });
});

async function getCurrentTab() {
  const opt = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(opt);
  return tab;
}
