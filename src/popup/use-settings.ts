import { Dispatch, useEffect, useReducer } from 'react';
import { DEFAULT_SETTINGS, Settings } from './default-settings';
import * as StorageUtil from './storage-util';

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);
const keyToSetterName = (key: string) => 'set' + key[0].toUpperCase() + key.slice(1);

/**
 * action names
 */
const setEnabled = 'setEnabled';
const setExpanded = 'setExpanded';
const setTheme = 'setTheme';
const setEnableGlob = 'setEnableGlob';
const setWhitelist = 'setWhitelist';
export const SETTINGS_ACTION_NAMES = { setEnabled, setExpanded, setTheme, setEnableGlob, setWhitelist };

/**
 * reducer
 * @param settings
 * @param action
 */
function reducer(settings: Settings, action: SettingsAction) {
  switch (action.type) {
    case setEnabled: {
      const enabled = action.payload as boolean;
      if (settings.enabled === enabled) return settings;

      void StorageUtil.set({ enabled }).then();
      return { ...settings, enabled };
    }

    case setExpanded: {
      const expanded = action.payload as boolean;
      if (settings.expanded === expanded) return settings;

      void StorageUtil.set({ expanded }).then();
      return { ...settings, expanded };
    }

    case setTheme: {
      const theme = action.payload as string;
      if (settings.theme === theme) return settings;

      void StorageUtil.set({ theme }).then();
      return { ...settings, theme };
    }

    case setEnableGlob: {
      const enableGlob = action.payload as boolean;
      if (settings.enableGlob === enableGlob) return settings;

      void StorageUtil.set({ enableGlob }).then();
      return { ...settings, enableGlob };
    }

    case setWhitelist: {
      const whitelist = action.payload as string;
      if (settings.whitelist === whitelist) return settings;

      void StorageUtil.set({ whitelist }).then();
      return { ...settings, whitelist };
    }

    default:
      throw new Error();
  }
}

/**
 * settings hook，读取、更新、自动保存settings状态
 */
export function useSettings(): [Settings, Dispatch<SettingsAction>] {
  const [settings, dispatch] = useReducer(reducer, {
    enabled: false,
    expanded: false,
    theme: '',
    enableGlob: false,
    whitelist: '',
  });

  // 读取本地插件配置
  useEffect(() => {
    void StorageUtil.get(SETTINGS_KEYS).then((settings) => {
      SETTINGS_KEYS.forEach((key) => {
        dispatch({ type: keyToSetterName(key), payload: settings[key as keyof Settings] });
      });
    });
  }, []);

  // 插件配置变化时，更新配置状态
  useEffect(() => {
    function callback(changes: StorageUtil.StorageChanges, areaName: string) {
      if (areaName !== 'local') return;

      SETTINGS_KEYS.forEach((key) => {
        if (!changes[key]) return;
        dispatch({ type: keyToSetterName(key), payload: changes[key].newValue });
      });
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
