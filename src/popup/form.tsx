import React from 'react';
import { Input, Radio, RadioChangeEvent, Switch } from 'antd';
import { ALL_MATCHED_OPTIONS, THEME_OPTIONS, POSITION_OPTIONS } from '../shared/default-settings';
import { SETTINGS_ACTION_NAMES, useSettings } from '../shared/use-settings';
import pkg from '../../package.json';
import manifest from '../../public/manifest.json';
import './form.less';

export function Form() {
  const [settings, dispatch] = useSettings();

  const setEnabled = (checked: boolean) => dispatch({ type: SETTINGS_ACTION_NAMES.setEnabled, payload: checked });
  const setPosition = (position: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setPosition, payload: position });
  const setTheme = (theme: string) => dispatch({ type: SETTINGS_ACTION_NAMES.setTheme, payload: theme });
  const setAllMatched = (checked: boolean) => dispatch({ type: SETTINGS_ACTION_NAMES.setAllMatched, payload: checked });

  const setWhitelist = (evt: React.ChangeEvent) => {
    dispatch({ type: SETTINGS_ACTION_NAMES.setWhitelist, payload: (evt.target as HTMLTextAreaElement).value });
  };

  return (
    <>
      <section className="popup-container">
        <div className="popup-title space-between">
          <span>
            <b>{manifest.name}</b>&ensp;V{manifest.version}
          </span>
          <Switch checked={settings.enabled} onChange={setEnabled} checkedChildren="开启" unCheckedChildren="关闭" />
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
          <span>🌐&ensp;匹配网站</span>
          <Radio.Group
            options={ALL_MATCHED_OPTIONS}
            onChange={(e: RadioChangeEvent) => setAllMatched(e.target.value as boolean)}
            value={settings.allMatched}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <Input.TextArea
          value={settings.whitelist}
          onChange={setWhitelist}
          autoSize={{ minRows: 5, maxRows: 15 }}
          disabled={settings.allMatched}
          maxLength={1000}
          placeholder="请输入网站匹配规则，规则使用glob编写，多个规则用换行符分隔"
          showCount={true}
        />

        <div className="popup-footer">
          <span>❗&ensp;</span>
          <a href={pkg.homepage + '#配置说明'} target="_blank" rel="noreferrer">
            配置说明
          </a>
          <span>&emsp;&emsp;</span>
          <span>🐞&ensp;</span>
          <a href={pkg.bugs.url} target="_blank" rel="noreferrer">
            反馈问题
          </a>
        </div>
      </section>
    </>
  );
}
