/* eslint-disable */
import { DEFAULT_SETTINGS } from '../popup/default-settings';

chrome.runtime.onInstalled.addListener((details: { reason: string }) => {
  if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) return;
  chrome.storage.local.set(DEFAULT_SETTINGS).then();
});
