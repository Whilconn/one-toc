import React, { useState } from 'react';
import Switch from 'rc-switch';
import '../storage';
import 'rc-switch/assets/index.css';
import './form.less';

export function Form() {
  const d1 = localStorage.getItem('open') || '';
  const d2 = localStorage.getItem('whiteList') || '';

  const [open, setOpen] = useState(d1 === 'true');
  const [whitelist, setWhitelist] = useState(d2);

  function toggle(checked: boolean) {
    setOpen(checked);
    localStorage.setItem('open', checked.toString());
  }

  function changeWhitelist(evt: React.ChangeEvent) {
    const val = (evt.target as HTMLTextAreaElement).value;
    saveWhitelist(val);
  }

  function resetWhitelist() {
    saveWhitelist('');
  }

  function saveWhitelist(val: string) {
    setWhitelist(val);
    localStorage.setItem('whiteList', val);
  }

  return (
    <>
      <section className="popup-container">
        <p>
          启用插件： <Switch checked={open} onChange={toggle} />
        </p>
        <p>
          网站白名单：<button onClick={resetWhitelist}>重置为默认</button>
        </p>
        <p>
          <textarea value={whitelist} onChange={changeWhitelist} cols={30} rows={10} />
        </p>
      </section>
    </>
  );
}
