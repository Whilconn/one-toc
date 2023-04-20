import { Toc } from './toc';
import { CID, MSG_NAMES } from '../shared/constants';
import { addMessageListener, Message } from '../extension-utils/api';
import ReactDOM, { Root } from 'react-dom/client';
import React from 'react';
import { ErrorBoundary } from '../shared/error-boundary';

let oneTocRoot: Root | null = null;

function toggleToc() {
  const rootNode = document.getElementById(CID) || document.createElement('div');
  if (!rootNode.isConnected) {
    rootNode.id = CID;
    rootNode.classList.add('onetoc-root');
    document.documentElement.append(rootNode);
  }

  if (!oneTocRoot) oneTocRoot = ReactDOM.createRoot(rootNode);

  if (rootNode.children.length) return hideToc();

  oneTocRoot.render(
    <React.StrictMode>
      <ErrorBoundary className="onetoc-container onetoc-embed">
        <Toc hideToc={hideToc} />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

function hideToc() {
  oneTocRoot?.render(<></>);
}

// 监听后台消息，用于监听开启、关闭快捷键 Command+B
addMessageListener((msg: Message) => {
  if (msg.name === MSG_NAMES.TOGGLE_TOC) toggleToc();
});

if (import.meta.env.DEV) setTimeout(toggleToc, 1000);
