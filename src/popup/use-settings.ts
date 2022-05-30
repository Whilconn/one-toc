import { Dispatch, useEffect, useReducer } from 'react';
import { DEFAULT_SETTINGS, SETTINGS_KEYS, Settings } from './default-settings';
import * as StorageUtil from './storage-util';
import { StorageChanges } from './storage-util';

const setEnabled = 'setEnabled';
const setWhitelist = 'setWhitelist';
const resetWhitelist = 'resetWhitelist';
export const SETTINGS_ACTION_NAMES = { setEnabled, setWhitelist, resetWhitelist };

function reducer(settings: Settings, action: SettingsAction) {
  switch (action.type) {
    case setEnabled: {
      const enabled = action.payload as boolean;
      if (settings.enabled === enabled) return settings;

      void StorageUtil.set({ enabled }).then();
      return { ...settings, enabled };
    }
    case setWhitelist: {
      const whitelist = action.payload as string;
      if (settings.whitelist === whitelist) return settings;

      void StorageUtil.set({ whitelist }).then();
      return { ...settings, whitelist };
    }
    case resetWhitelist: {
      const whitelist = DEFAULT_SETTINGS.whitelist;
      if (settings.whitelist === whitelist) return settings;

      void StorageUtil.set({ whitelist }).then();
      return { ...settings, whitelist };
    }
    default:
      throw new Error();
  }
}

export function useSettings(): [Settings, Dispatch<SettingsAction>] {
  const [settings, dispatch] = useReducer(reducer, { enabled: false, whitelist: '' });

  // 读取本地插件配置
  useEffect(() => {
    void StorageUtil.get([SETTINGS_KEYS.ENABLED, SETTINGS_KEYS.WHITELIST]).then((settings) => {
      dispatch({ type: setEnabled, payload: settings.enabled });
      dispatch({ type: setWhitelist, payload: settings.whitelist });
    });
  }, []);

  // 插件配置变化时，更新配置状态
  useEffect(() => {
    function callback(changes: StorageChanges, areaName: string) {
      if (areaName !== 'local') return;

      if (changes.enabled) {
        dispatch({ type: SETTINGS_ACTION_NAMES.setEnabled, payload: changes.enabled.newValue as boolean });
      }
      if (changes.whitelist) {
        dispatch({ type: SETTINGS_ACTION_NAMES.setWhitelist, payload: changes.whitelist.newValue as string });
      }
    }

    StorageUtil.addListener(callback);
    return () => StorageUtil.removeListener(callback);
  }, [settings, dispatch]);

  return [settings, dispatch];
}

export interface SettingsAction {
  type: string;
  payload?: boolean | string | undefined;
}
