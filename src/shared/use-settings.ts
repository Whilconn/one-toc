import { Dispatch, useEffect, useReducer } from 'react';
import { SETTINGS_KEYS, Settings } from './settings';
import * as BrowserStorage from '../utils/browser-storage';

const keyToSetterName = (key: string) => 'set' + key[0].toUpperCase() + key.slice(1);

/**
 * action names
 */
const setEnabled = 'setEnabled';
const setPosition = 'setPosition';
const setTheme = 'setTheme';
const setAllMatched = 'setAllMatched';
const setWhitelist = 'setWhitelist';
export const SETTINGS_ACTION_NAMES = { setEnabled, setPosition, setTheme, setAllMatched, setWhitelist };

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

      void BrowserStorage.set({ enabled }).then();
      return { ...settings, enabled };
    }

    case setPosition: {
      const position = action.payload as string;
      if (settings.position === position) return settings;

      void BrowserStorage.set({ position }).then();
      return { ...settings, position };
    }

    case setTheme: {
      const theme = action.payload as string;
      if (settings.theme === theme) return settings;

      void BrowserStorage.set({ theme }).then();
      return { ...settings, theme };
    }

    case setAllMatched: {
      const allMatched = action.payload as boolean;
      if (settings.allMatched === allMatched) return settings;

      void BrowserStorage.set({ allMatched }).then();
      return { ...settings, allMatched };
    }

    case setWhitelist: {
      const whitelist = action.payload as string;
      if (settings.whitelist === whitelist) return settings;

      void BrowserStorage.set({ whitelist }).then();
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
    position: '',
    theme: '',
    allMatched: false,
    whitelist: '',
  });

  // 读取本地插件配置
  useEffect(() => {
    void BrowserStorage.get(SETTINGS_KEYS).then((settings) => {
      SETTINGS_KEYS.forEach((key) => {
        dispatch({ type: keyToSetterName(key), payload: settings[key as keyof Settings] });
      });
    });
  }, []);

  // 插件配置变化时，更新配置状态
  useEffect(() => {
    function callback(changes: BrowserStorage.StorageChanges, areaName: string) {
      if (areaName !== 'local') return;

      SETTINGS_KEYS.forEach((key) => {
        if (!changes[key]) return;
        dispatch({ type: keyToSetterName(key), payload: changes[key].newValue });
      });
    }

    BrowserStorage.addListener(callback);
    return () => BrowserStorage.removeListener(callback);
  }, [settings, dispatch]);

  return [settings, dispatch];
}

export interface SettingsAction {
  type: string;
  payload?: boolean | string | undefined;
}
