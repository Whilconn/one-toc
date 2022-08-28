import React from 'react';
import { Switch, Radio } from 'antd';
import { SETTINGS_ACTION_NAMES, useSettings } from './use-settings';
import pkg from '../../package.json';
import manifest from '../../public/manifest.json';
import './form.less';

export function Form() {
  const [settings, dispatch] = useSettings();

  const setEnabled = (checked: boolean) => dispatch({ type: SETTINGS_ACTION_NAMES.setEnabled, payload: checked });
  const setExpanded = (checked: boolean) => dispatch({ type: SETTINGS_ACTION_NAMES.setExpanded, payload: checked });

  const setWhitelist = (evt: React.ChangeEvent) => {
    dispatch({ type: SETTINGS_ACTION_NAMES.setWhitelist, payload: (evt.target as HTMLTextAreaElement).value });
  };
  const resetWhitelist = () => dispatch({ type: SETTINGS_ACTION_NAMES.resetWhitelist });

  const options = [
    { label: '毛玻璃', value: 'aero' },
    { label: '纯白', value: 'white' },
    { label: '暗黑', value: 'dark' },
  ];

  return (
    <>
      <section className="popup-container">
        <p className="popup-title">
          <b>{manifest.name}</b>&ensp;
          <span>V{manifest.version}</span>
        </p>
        <p className="space-between">
          <span>🚀&ensp;启用</span>
          <Switch checked={settings.enabled} onChange={setEnabled} />
        </p>
        <p className="space-between">
          <span>☀️&ensp;主题</span>
          <Radio.Group
            options={options}
            onChange={console.log}
            value={settings.theme}
            optionType="button"
            buttonStyle="solid"
          />
        </p>
        <p className="space-between">
          <span>☀️&ensp;默认展开</span>
          <Switch checked={settings.expanded} onChange={setExpanded} />
        </p>
        <p className="space-between">
          <span>🌐&ensp;启用网站</span>
          <Switch checked={settings.matchAll} onChange={setExpanded} />
        </p>
        {!settings.matchAll ? (
          <p>
            <a onClick={resetWhitelist}>推荐配置</a>
            <textarea value={settings.whitelist} onChange={setWhitelist} rows={10} />
          </p>
        ) : null}
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
