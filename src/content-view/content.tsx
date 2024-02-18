import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import * as micromatch from 'micromatch';
import { Toc } from './toc';
import { CID, MSG_NAMES } from '../shared/constants';
import { ErrorBoundary } from '../shared/error-boundary';
import { addMessageListener, Message } from '../extension-utils/api';
import { loadSettings, Settings } from '../extension-utils/settings';

let visible = false;
let reactRoot: Root | null = null;

function getRoot() {
  const container = document.getElementById(CID) || document.createElement('div');
  if (!container.isConnected) {
    container.id = CID;
    container.classList.add('onetoc-root');
    document.documentElement.append(container);
  }

  if (!reactRoot) reactRoot = ReactDOM.createRoot(container);

  return reactRoot;
}

function hideToc() {
  const root = getRoot();
  visible = false;

  root.render(<></>);
}

function showToc() {
  const root = getRoot();
  visible = true;

  root.render(
    <React.StrictMode>
      <ErrorBoundary className="onetoc-container onetoc-embed">
        <Toc hideToc={hideToc} />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

function toggleToc() {
  visible ? hideToc() : showToc();
}

// 监听后台消息，用于监听开启、关闭快捷键 Command+B
addMessageListener((msg: Message) => {
  if (msg.name === MSG_NAMES.TOGGLE_TOC) toggleToc();
});

/** 自动打开相关逻辑 **/
function findAutoOpenRule(settings: Settings) {
  if (!settings.whitelist) return null;

  const pathInUrl = location.host + location.pathname;

  return (settings.whitelist || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .find((w) => location.href.startsWith(w) || micromatch.isMatch(pathInUrl, w));
}

void loadSettings().then((s) => {
  if (!s.autoOpen) return;

  const rule = findAutoOpenRule(s) || '';
  if (rule) showToc();
  // if (import.meta.env.DEV) setTimeout(showToc, 1000);
});
