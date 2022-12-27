import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { THEME_OPTIONS, POSITION_OPTIONS } from '../shared/settings';
import { SETTINGS_ACTION_NAMES, useSettings } from '../shared/use-settings';
import pkg from '../../package.json';
import manifest from '../../public/manifest.json';
import './form.less';

export function Form() {
  const [settings, dispatch] = useSettings();

  const setPosition = (position: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setPosition, payload: position });
  const setTheme = (theme: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setTheme, payload: theme });

  const ua = window.navigator.userAgent;
  const isMacOs = /Mac\s*OS/gi.test(ua);
  const cKey = isMacOs ? '⌘' : 'Ctrl';

  return (
    <>
      <section className="settings-container">
        <div className="settings-title space-between">
          <b className="flex1">设置</b>
        </div>

        <div className="space-between">
          <span>🌈️&ensp;主题</span>
          <Radio.Group
            options={THEME_OPTIONS}
            onChange={(e: RadioChangeEvent) => setTheme(e.target.value as string)}
            value={settings.theme}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <div className="space-between">
          <span>📌️&ensp;定位</span>
          <Radio.Group
            options={POSITION_OPTIONS}
            onChange={(e: RadioChangeEvent) => setPosition(e.target.value as string)}
            value={settings.position}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <div className="space-between">
          <span>🚀&ensp;快捷键</span>
          <span className="shortcut">{cKey} B</span>&ensp;
        </div>

        <div className="settings-footer">
          <p className="space-between">
            <a href={pkg.homepage + '#配置说明'} target="_blank" rel="noreferrer">
              ❗&ensp;配置说明
            </a>
            <a
              href={`https://support.qq.com/product/441695?clientInfo=${encodeURIComponent(ua)}`}
              target="_blank"
              rel="noreferrer"
            >
              🙋&ensp;反馈建议
            </a>
            <a href={pkg.bugs.url} target="_blank" rel="noreferrer">
              🐞&ensp;技术交流
            </a>
          </p>
          <p className="space-between">
            {manifest.name}&ensp;V{manifest.version}
          </p>
        </div>
      </section>
    </>
  );
}
