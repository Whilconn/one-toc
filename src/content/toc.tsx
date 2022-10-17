import React, { useEffect, useMemo, useRef } from 'react';
import * as micromatch from 'micromatch';
import Draggable from 'react-draggable';
import { TocHead } from './toc-head';
import { TocBody } from './toc-body';
import { useTitle } from './hooks';
import { MSG_NAMES } from '../shared/constants';
import * as BrowserMessage from '../utils/browser-message';
import { getFixedHeaderHeight } from '../utils/header-util';
import { POS_FIXED, Settings } from '../shared/default-settings';
import { SETTINGS_ACTION_NAMES, useSettings } from '../shared/use-settings';
import './toc.less';

export function Toc() {
  const dragRef = useRef(null);

  const [settings, dispatch] = useSettings();
  const visible = useMemo(() => !shouldHide(settings), [settings]);
  const isFixed = settings.position === POS_FIXED;

  const title = useTitle();
  const top = useMemo(getFixedHeaderHeight, [title]);
  const style = isFixed ? { top: `${top}px`, maxHeight: `calc(100vh - ${top}px - 20px)` } : {};

  const showToc = (enabled: boolean) => {
    dispatch({ type: SETTINGS_ACTION_NAMES.setEnabled, payload: enabled });
  };

  // 内嵌模式下修改源网页的布局
  useEffect(() => {
    if (!visible || isFixed) return;

    const restoreLayout = changeLayout();
    return () => restoreLayout();
  }, [visible, isFixed]);

  // 监听后台消息，此处主要用于监听开启、关闭快捷键 Command+B
  useEffect(() => {
    const handler = (msg: BrowserMessage.Message) => {
      if (msg.name === MSG_NAMES.TOGGLE_TOC) showToc(!visible);
    };

    BrowserMessage.addListener(handler);
    return () => BrowserMessage.removeListener(handler);
  }, [visible]);

  if (!visible) return null;

  return (
    <Draggable nodeRef={dragRef} bounds="html" cancel=".toc-body">
      <nav
        ref={dragRef}
        className={`toc-container ${!isFixed ? 'toc-embed' : ''}`}
        style={style}
        data-theme={settings.theme}
      >
        <TocHead title={title} hideToc={() => showToc(false)} />
        <TocBody />
      </nav>
    </Draggable>
  );
}

function shouldHide(settings: Settings) {
  if (!settings.enabled || (!settings.allMatched && !settings.whitelist)) return true;

  const url = location.host + location.pathname;
  const whitelist = settings.whitelist
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return !settings.allMatched && (!whitelist.length || !micromatch.some(url, whitelist));
}

function getLayoutNodes() {
  return [document.body].filter((n) => n.clientWidth >= document.body.clientWidth && n.clientHeight);
}

function changeLayout() {
  const nodes = getLayoutNodes();
  nodes.forEach((n) => {
    const w = '260px';
    n.style.width = `calc(100vw - ${w})`;
    n.style.transform = `translateX(${w})`;
  });

  return function restoreLayout() {
    const nodes = getLayoutNodes();
    nodes.forEach((n) => {
      n.style.removeProperty('width');
      n.style.removeProperty('transform');
    });
  };
}
