/* eslint-disable */

export function addListener(callback: Callback) {
  chrome.runtime.onMessage.addListener(callback);
}

export function removeListener(callback: Callback) {
  chrome.runtime.onMessage.removeListener(callback);
}

type Callback = (msg: Message) => void;

export interface Message {
  name: string;
  payload?: any;
}
