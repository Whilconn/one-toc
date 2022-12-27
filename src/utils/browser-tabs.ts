/* eslint-disable */

export function createTab(url: string) {
  chrome.tabs.create({ url });
}
