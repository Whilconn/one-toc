import React from 'react';
import Switch from 'rc-switch';
import { SETTINGS_ACTION_NAMES, useSettings } from '../use-settings';
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
          启用插件： <Switch checked={settings.enabled} onChange={setEnabled} />
        </p>
        <p>
          网站白名单：
          <button onClick={resetWhitelist}>重置为默认</button>
        </p>
        <p>
          <textarea value={settings.whitelist} onChange={setWhitelist} rows={15} />
        </p>
      </section>
    </>
  );
}
