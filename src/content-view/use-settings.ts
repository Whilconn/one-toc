import { useEffect, useState } from 'react';
import { loadSettings, Settings } from '../extension-utils/settings';
import { useEventListener } from './hooks';

// 浅比较 TODO: 遍历key value对比
function equals(a: object | undefined | null, b: object | undefined | null) {
  if (a === b) return true;
  return a && b && Object.entries(a).flat().join() === Object.entries(b).flat().join();
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  async function updateSettings() {
    const st = await loadSettings();
    setSettings((prevSt) => {
      return equals(prevSt, st) ? prevSt : st;
    });
  }

  // 初始化时，获取配置
  useEffect(() => void updateSettings(), []);

  // 页面切换时，更新配置
  useEventListener(document, 'visibilitychange', updateSettings);

  return settings;
}
