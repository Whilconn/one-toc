import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Col, Form, Input, message, Radio, Row } from 'antd';
import { splitTextByLine } from '../content-utils/text-util';
import { Command, createTab, getAllCommands } from '../extension-utils/api';
import { useEventListener } from '../content-view/hooks';
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
import { updateResolveRules } from '../shared/resolve-rules-util';
import pkg from '../../package.json';
import './options.less';

const resolveUrl = import.meta.env.VITE_RESOLVE_URL as string;

function openShortcutsPage() {
  createTab('chrome://extensions/shortcuts');
}

function onUpdateResolveRules() {
  updateResolveRules()
    .then((rules) => {
      return message.success(`更新成功！(新版本号: ${rules.version})`);
    })
    .catch((err: Error) => {
      return message.error(`更新失败！(${err?.message || '未知错误'})`);
    });
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
  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') return;
    void getAllCommands().then(setCommands);
  });

  function save(st: Settings) {
    st.autoOpenRules = splitTextByLine(st.autoOpenRules).join('\n');
    form.setFieldValue(SETTINGS_KEYMAP.autoOpenRules, st.autoOpenRules);

    void saveSettings(st).then(() => {
      return message.success('保存成功');
    });
  }

  function reset() {
    const st: Settings = {
      ...DEFAULT_SETTINGS,
      // knownVersion 不需要重置
      knownVersion: form.getFieldValue(SETTINGS_KEYMAP.knownVersion) as string,
    };
    form.setFieldsValue(st);
    void saveSettings(st).then();
  }

  return (
    <Form
      form={form}
      onFinish={save}
      colon={false}
      labelAlign="left"
      labelCol={{ flex: '90px' }}
      className="settings-container"
    >
      <div className="settings-title">设置</div>
      <Form.Item name={SETTINGS_KEYMAP.theme} label="🌈️&ensp;主题">
        <Radio.Group options={THEME_OPTIONS} optionType="button" />
      </Form.Item>

      <Form.Item name={SETTINGS_KEYMAP.position} label="📌️&ensp;定位">
        <Radio.Group options={POSITION_OPTIONS} optionType="button" />
      </Form.Item>

      <Form.Item name={SETTINGS_KEYMAP.strategy} label="🌐&ensp;优先显示">
        <Radio.Group options={STRATEGY_OPTIONS} optionType="button" />
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

      <Form.Item label="📝&ensp;解析规则">
        <Button href={resolveUrl} type="link" target="_blank">
          查看
        </Button>
        <Button onClick={onUpdateResolveRules} type="link">
          更新
        </Button>
      </Form.Item>

      <p>🚁&ensp;自动打开规则</p>

      <Form.Item name={SETTINGS_KEYMAP.autoOpenRules}>
        <Input.TextArea
          placeholder="该配置项是多行文本，每一行是一个匹配规则（必选）和一个毫秒数（可选），二者使用空格隔开"
          autoSize={{ minRows: 3, maxRows: 20 }}
        />
      </Form.Item>

      <Row justify="space-between">
        <Col span={10}>
          <Button htmlType="submit" type="primary" block>
            保存
          </Button>
        </Col>
        <Col span={10}>
          <Button onClick={reset} block>
            重置
          </Button>
        </Col>
      </Row>

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
