import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Form, Input, message, Radio, Space, Switch } from 'antd';
import { Command, createTab, getAllCommands } from '../extension-utils/api';
import {
  THEME_OPTIONS,
  POSITION_OPTIONS,
  SETTINGS_KEYMAP,
  Settings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  STRATEGY_OPTIONS,
} from '../extension-utils/settings';
import pkg from '../../package.json';
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
    const st = {
      ...DEFAULT_SETTINGS,
      // knownVersion 不需要重置
      knownVersion: form.getFieldValue('knownVersion') as string,
    };
    form.setFieldsValue(st);
    void saveSettings(st).then();
  }

  return (
    <Form form={form} onFinish={save} labelAlign="right" labelCol={{ flex: '90px' }} className="settings-container">
      <div className="settings-title">设置</div>
      <Form.Item name={SETTINGS_KEYMAP.theme} label="🌈️&ensp;主题">
        <Radio.Group options={THEME_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>

      <Form.Item name={SETTINGS_KEYMAP.position} label="📌️&ensp;定位">
        <Radio.Group options={POSITION_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>

      <Form.Item name={SETTINGS_KEYMAP.strategy} label="🌐&ensp;优先显示">
        <Radio.Group options={STRATEGY_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>

      {commands?.map((c) => {
        if (!c.description) return null;

        return (
          <Form.Item key={c.name} label="🚀&ensp;快捷键">
            <b>{c.shortcut}</b>
            <span className="shortcut-desc">{c.description}</span>
            <Button onClick={openShortcutsPage} type="link">
              去设置
            </Button>
          </Form.Item>
        );
      })}

      <Form.Item name={SETTINGS_KEYMAP.autoOpen} label="🚁&ensp;自动打开" valuePropName="checked">
        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      </Form.Item>

      <p>📝&ensp;自动打开白名单：</p>

      <Form.Item name={SETTINGS_KEYMAP.whitelist}>
        <Input.TextArea
          placeholder="自动打开白名单"
          autoSize={{ minRows: 3, maxRows: 20 }}
          disabled={!form.getFieldValue(SETTINGS_KEYMAP.autoOpen)}
        />
      </Form.Item>

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
          {pkg.extName}&ensp;V{pkg.version}
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
