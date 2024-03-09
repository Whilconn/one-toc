import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import * as micromatch from 'micromatch';
import { Toc } from './toc';
import { CID, MSG_NAMES } from '../shared/constants';
import { ErrorBoundary } from '../shared/error-boundary';
import { addMessageListener, Message } from '../extension-utils/api';
import { loadSettings, Settings } from '../extension-utils/settings';
import { splitTextByLine } from '../content-utils/text-util';
import { updateResolveRules } from '../shared/resolve-rules-util';

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
function findAutoOpenRule(settings: Settings): [string, number] | void {
  if (!settings.autoOpenRules) return;

  const pathInUrl = location.host + location.pathname;

  return splitTextByLine(settings.autoOpenRules || '')
    .map((s) => {
      const [glob, t] = s.split(/\s+/);
      return [glob, +t] as [string, number];
    })
    .find(([glob]) => {
      return micromatch.some([location.href, pathInUrl], glob);
    });
}

void loadSettings().then((s) => {
  void updateResolveRules();

  const rule = findAutoOpenRule(s);
  if (!rule) return;

  if (rule[1]) return setTimeout(showToc, rule[1]);

  showToc();
});
