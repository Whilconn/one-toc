/* eslint-disable */

export function getAllCommands(): Promise<Command[]> {
  return chrome.commands
    .getAll()
    .then((commands: any) => {
      if (import.meta.env.DEV) console.log('[getAllCommands Success]:', commands);
      return commands;
    })
    .catch((error: any) => {
      if (import.meta.env.DEV) console.error('[getAllCommands Error]:', error);
    });
}

export function loadStorage(keys: string | string[]) {
  return chrome.storage.local
    .get(keys)
    .then((settings: any) => {
      if (import.meta.env.DEV) console.log('[loadStorage Success]:', settings);
      return settings;
    })
    .catch((error: any) => {
      if (import.meta.env.DEV) console.error('[loadStorage Error]:', error);
    });
}

export function saveStorage(settings: any) {
  return chrome.storage.local
    .set(settings)
    .then((settings: any) => {
      if (import.meta.env.DEV) console.log('[saveStorage Success]:', settings);
    })
    .catch((error: any) => {
      if (import.meta.env.DEV) console.error('[saveStorage Error]:', error);
    });
}

export function createTab(url: string) {
  chrome.tabs
    .create({ url })
    .then((tab: Tab) => {
      if (import.meta.env.DEV) console.log('[createTab Success]:', tab.id);
    })
    .catch((error: any) => {
      if (import.meta.env.DEV) console.error('[createTab Error]:', error);
    });
}

export function sendTabMessage(tab: Tab, name: string) {
  chrome.tabs
    .sendMessage(tab.id, { name })
    .then((response: any) => {
      if (import.meta.env.DEV) console.log('[sendTabMessage Success]:', response.response);
    })
    .catch((error: any) => {
      if (import.meta.env.DEV) console.error('[sendTabMessage Error]:', error);
    });
}

export function addInstalledListener(callback: (details: { reason: string }) => void) {
  chrome.runtime.onInstalled.addListener(callback);
}

export function addMessageListener(callback: (msg: Message) => void) {
  chrome.runtime.onMessage.addListener(callback);
}

async function getCurrentTab() {
  const opt = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(opt);
  return tab;
}

export function addCommandListener(callback: (name: string, tab: Tab) => void) {
  chrome.commands.onCommand.addListener(async (name: string, tab: Tab) => {
    if (!tab?.id) tab = await getCurrentTab();
    await callback(name, tab);
  });
}

export function addClickActionListener(callback: (tab: Tab) => void) {
  chrome.commands.onCommand.addListener(async (tab: Tab) => {
    if (!tab?.id) tab = await getCurrentTab();
    await callback(tab);
  });
}

export const INSTALL_REASON = chrome.runtime.OnInstalledReason.INSTALL;

/** types */
export interface Command {
  name: string;
  shortcut: string;
  description: string;
}

export interface Message {
  name: string;
  payload?: any;
}

export interface Tab {
  id: number;
  url: string;
  title: string;
}
