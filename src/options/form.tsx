import React, { useEffect, useMemo, useState } from 'react';
import { Button, Radio, RadioChangeEvent } from 'antd';
import { THEME_OPTIONS, POSITION_OPTIONS } from '../shared/settings';
import { SETTINGS_ACTION_NAMES, useSettings } from '../shared/use-settings';
import { createTab } from '../utils/browser-tabs';
import { Command, getAllCommands } from '../utils/browser-commands';
import pkg from '../../package.json';
import manifest from '../../public/manifest.json';
import './form.less';

function openShortcutsPage() {
  createTab('chrome://extensions/shortcuts');
}

export function Form() {
  const ua = window.navigator.userAgent;
  const [settings, dispatch] = useSettings();

  const setPosition = (position: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setPosition, payload: position });
  const setTheme = (theme: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setTheme, payload: theme });

  const [commands, setCommands] = useState<Command[]>();
  useEffect(() => {
    void getAllCommands().then((c) => setCommands(c));
  }, []);

  return (
    <>
      <section className="settings-container">
        <div className="settings-title">外观设置</div>

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

        <div className="settings-title">快捷键设置</div>

        {commands?.map((c) => {
          return (
            <div key={c.name} className="space-between">
              <span>
                {c.shortcut}&ensp;-&ensp;
                <span className="shortcut-desc">{c.description}</span>
              </span>
              <Button onClick={openShortcutsPage} type="link">
                去设置
              </Button>
            </div>
          );
        })}

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
