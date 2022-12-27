import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useEventListener, useTitle } from './hooks';
import { getAnchors } from '../utils/anchor-util';
import { getFixedHeaderHeight } from '../utils/header-util';
import { scrollByApi } from '../utils/scroll-util';
import { getText } from '../utils/dom-util';
import { TOC_LEVEL } from '../shared/constants';
import './toc-body.less';

export function TocBody() {
  const [current, setCurrent] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const title = useTitle();
  const anchorNodes = useMemo(getAnchors, [title]);

  function activeLink() {
    const now = Date.now();
    if (now - activeTime < 100) return;

    setActiveTime(now);

    let height = getFixedHeaderHeight();
    height = Math.max(height, headerHeight);
    if (height > headerHeight) setHeaderHeight(height);

    const offset = 5;
    const idx = anchorNodes.findIndex((n, i) => {
      if (i === anchorNodes.length - 1) return i;

      const top = anchorNodes[i + 1].getBoundingClientRect().top;
      return top > height + offset;
    });

    setCurrent(idx);
  }

  // 高亮链接：首次进入页面
  useEffect(activeLink, [anchorNodes]);

  // 高亮链接：滚动页面
  const memoActiveLink = useCallback(activeLink, [anchorNodes, activeTime, headerHeight]);
  useEventListener(window, 'scroll', memoActiveLink);

  function clickAnchor(i: number, anchorNode: HTMLElement) {
    setActiveTime(Date.now());
    setCurrent(i);

    let height = getFixedHeaderHeight();
    height = Math.max(height, headerHeight);
    if (height > headerHeight) setHeaderHeight(height);

    // scrollByHash(anchorNode, height);
    scrollByApi(anchorNode, height);
  }

  return (
    <div className="onetoc-body">
      {anchorNodes.map((node, i) => {
        const text = getText(node);
        const cls = [TOC_LEVEL + (node.getAttribute(TOC_LEVEL) || ''), i === current ? 'active' : ''].join(' ');

        return (
          <a key={node.id} onClick={() => clickAnchor(i, node)} className={cls} title={text}>
            {text}
          </a>
        );
      })}
      {!anchorNodes.length && <p className="no-content">暂无数据</p>}
    </div>
  );
}
