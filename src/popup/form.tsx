import React from 'react';
import Switch from 'rc-switch';
import { SETTINGS_ACTION_NAMES, useSettings } from './use-settings';
import pkg from '../../package.json';
import 'rc-switch/assets/index.css';
import './form.less';

export function Form() {
  const [settings, dispatch] = useSettings();

  const setEnabled = (checked: boolean) => dispatch({ type: SETTINGS_ACTION_NAMES.setEnabled, payload: checked });

  const setWhitelist = (evt: React.ChangeEvent) => {
    dispatch({ type: SETTINGS_ACTION_NAMES.setWhitelist, payload: (evt.target as HTMLTextAreaElement).value });
  };
  const resetWhitelist = () => dispatch({ type: SETTINGS_ACTION_NAMES.resetWhitelist });

  return (
    <>
      <section className="popup-container">
        <p>
          🚀&ensp;启用： <Switch checked={settings.enabled} onChange={setEnabled} />
        </p>
        <p>
          🌐&ensp;匹配规则：
          <a onClick={resetWhitelist}>重置为默认</a>
        </p>
        <p>
          <textarea value={settings.whitelist} onChange={setWhitelist} rows={10} />
        </p>
        <p>
          <span>❗&ensp;</span>
          <a href={pkg.homepage + '#配置说明'} target="_blank" rel="noreferrer">
            配置说明
          </a>
          <span>&emsp;&emsp;</span>
          <span>🐞&ensp;</span>
          <a href={pkg.bugs.url} target="_blank" rel="noreferrer">
            反馈问题
          </a>
        </p>
      </section>
    </>
  );
}
