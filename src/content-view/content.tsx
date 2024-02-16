import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import { Toc } from './toc';
import { CID, MSG_NAMES } from '../shared/constants';
import { ErrorBoundary } from '../shared/error-boundary';
import { addMessageListener, Message } from '../extension-utils/api';
import { loadSettings } from '../extension-utils/settings';

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

void loadSettings().then((s) => {
  // if (import.meta.env.DEV) setTimeout(showToc, 1000);
  if (s.autoOpen) showToc();
});
