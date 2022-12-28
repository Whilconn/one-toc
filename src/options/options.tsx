import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Form, message, Radio, Space } from 'antd';
import {
  THEME_OPTIONS,
  POSITION_OPTIONS,
  SETTINGS_KEYMAP,
  Settings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from '../shared/settings';
import { createTab } from '../utils/browser-tabs';
import { Command, getAllCommands } from '../utils/browser-commands';
import pkg from '../../package.json';
import manifest from '../../public/manifest.json';
import './options.less';

function openShortcutsPage() {
  createTab('chrome://extensions/shortcuts');
}

function Options() {
  const ua = window.navigator.userAgent;

  const [form] = Form.useForm();
  const [commands, setCommands] = useState<Command[]>();

  useEffect(() => {
    void loadSettings().then(form.setFieldsValue);
    void getAllCommands().then(setCommands);
  }, [form]);

  // 获取最新快捷键
  useEffect(() => {
    const eventName = 'visibilitychange';
    const handler = () => {
      if (document.visibilityState === 'hidden') return;
      void getAllCommands().then(setCommands);
    };
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, []);

  function save(st: Settings) {
    void saveSettings(st).then(() => {
      return message.success('保存成功');
    });
  }

  function reset() {
    form.setFieldsValue(DEFAULT_SETTINGS);
    void saveSettings(DEFAULT_SETTINGS).then();
  }

  return (
    <Form form={form} onFinish={save} labelAlign="right" labelCol={{ flex: '80px' }} className="settings-container">
      <div className="settings-title">设置</div>
      <Form.Item name={SETTINGS_KEYMAP.theme} label="🌈️&ensp;主题">
        <Radio.Group options={THEME_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>

      <Form.Item name={SETTINGS_KEYMAP.position} label="📌️&ensp;定位">
        <Radio.Group options={POSITION_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>

      {commands?.map((c) => {
        return (
          <Form.Item key={c.name} label="🚀&ensp;快捷键">
            {c.shortcut}&ensp;
            <span className="shortcut-desc">{c.description}</span>
            <Button onClick={openShortcutsPage} type="link">
              去设置
            </Button>
          </Form.Item>
        );
      })}

      <Form.Item label=" " colon={false}>
        <Space size="large">
          <Button htmlType="submit" type="primary">
            保存
          </Button>
          <Button onClick={reset}>重置</Button>
        </Space>
      </Form.Item>

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
    </Form>
  );
}

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
