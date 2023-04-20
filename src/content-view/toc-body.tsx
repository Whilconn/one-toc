import React, { useCallback, useEffect, useState } from 'react';
import { useEventListener } from './hooks';
import { getFixedHeaderHeight } from '../content-utils/header-util';
import { scrollByApi } from '../content-utils/scroll-util';
import { getText } from '../content-utils/dom-util';
import { TOC_LEVEL } from '../shared/constants';
import './toc-body.less';

export function TocBody({ headings }: Props) {
  const [current, setCurrent] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  function activeLink() {
    const now = Date.now();
    if (now - activeTime < 100) return;

    setActiveTime(now);

    let height = getFixedHeaderHeight();
    height = Math.max(height, headerHeight);
    if (height > headerHeight) setHeaderHeight(height);

    const offset = 5;
    const idx = headings.findIndex((n, i) => {
      if (i === headings.length - 1) return i;

      const top = headings[i + 1].getBoundingClientRect().top;
      return top > height + offset;
    });

    setCurrent(idx);
  }

  // 高亮链接：首次进入页面
  useEffect(activeLink, [headings]);

  // 高亮链接：滚动页面
  const memoActiveLink = useCallback(activeLink, [headings, activeTime, headerHeight]);
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
      {headings.map((node, i) => {
        const text = getText(node);
        const cls = [TOC_LEVEL + (node.getAttribute(TOC_LEVEL) || ''), i === current ? 'active' : ''].join(' ');

        return (
          <a key={i} onClick={() => clickAnchor(i, node)} data-index={i} className={cls} title={text}>
            {text}
          </a>
        );
      })}
      {!headings.length && <p className="no-content">暂无数据</p>}
    </div>
  );
}

type Props = { headings: HTMLElement[] };
