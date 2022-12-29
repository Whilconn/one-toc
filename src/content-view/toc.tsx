import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import Draggable from 'react-draggable';
import { CID } from '../shared/constants';
import { ErrorBoundary } from '../shared/error-boundary';
import { TocHead } from './toc-head';
import { TocBody } from './toc-body';
import { useTitle } from './hooks';
import { getFixedHeaderHeight } from '../content-utils/header-util';
import { changeLayout } from '../content-utils/layout-util';
import { loadSettings, POS_EMBED, Settings } from '../extension-utils/settings';
import './toc.less';

let oneTocRoot: Root | null = null;
export function renderToc() {
  const rootNode = document.getElementById(CID) || document.createElement('div');
  if (!rootNode.isConnected) {
    rootNode.id = CID;
    rootNode.classList.add('onetoc-root');
    document.documentElement.append(rootNode);
  }

  if (!oneTocRoot) oneTocRoot = ReactDOM.createRoot(rootNode);

  if (rootNode.children.length) return unmountToc();

  oneTocRoot.render(
    <React.StrictMode>
      <ErrorBoundary className="onetoc-container onetoc-embed">
        <Toc />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

function unmountToc() {
  oneTocRoot?.render(<></>);
}

// 浅比较
function equals(a: object | undefined | null, b: object | undefined | null) {
  if (a === b) return true;
  return a && b && Object.entries(a).flat().join() === Object.entries(b).flat().join();
}

export function Toc() {
  const dragRef = useRef(null);

  const [settings, setSettings] = useState<Settings>();

  // 初始化获取配置，页面切换获取最新配置
  useEffect(() => {
    const eventName = 'visibilitychange';
    const handler = () => {
      void loadSettings().then((st) => {
        setSettings((prevSt) => {
          return equals(prevSt, st) ? prevSt : st;
        });
      });
    };
    handler();
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, []);

  const isEmbed = settings?.position === POS_EMBED;

  const title = useTitle();
  const top = useMemo(getFixedHeaderHeight, [title]);
  const style = isEmbed ? {} : { top: `${top}px`, maxHeight: `calc(100vh - ${top}px - 20px)` };

  // 内嵌模式下修改源网页的布局
  useEffect(() => {
    if (!isEmbed) return;

    const restoreLayout = changeLayout();
    return () => restoreLayout();
  }, [isEmbed]);

  if (!settings) return null;

  return (
    <Draggable nodeRef={dragRef} disabled={isEmbed} bounds="html" cancel=".onetoc-body">
      <nav
        ref={dragRef}
        className={`onetoc-container ${isEmbed ? 'onetoc-embed no-drag' : ''}`}
        style={style}
        data-theme={settings.theme}
      >
        <TocHead title={title} hideToc={unmountToc} />
        <TocBody />
      </nav>
    </Draggable>
  );
}
