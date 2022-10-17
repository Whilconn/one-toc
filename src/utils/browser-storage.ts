/* eslint-disable */
import { Settings } from '../shared/default-settings';

export function get(key: string | string[]): Promise<Settings> {
  return chrome.storage.local.get(key);
}

export function set(settings: Partial<Settings>): Promise<void> {
  return chrome.storage.local.set(settings);
}

export function addListener(callback: (changes: StorageChanges, areaName: string) => void) {
  chrome.storage.onChanged.addListener(callback);
}

export function removeListener(callback: (changes: StorageChanges, areaName: string) => void) {
  chrome.storage.onChanged.removeListener(callback);
}

export interface StorageChanges {
  [key: string]: {
    newValue: boolean | string | undefined;
    oldValue: boolean | string | undefined;
  };
}
