import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { config } from '../config';
import { TocHead } from './toc-head';
import { TocBody } from './toc-body';
import { useEventListener, useTitle } from './hooks';
import { getAnchors, getAnchorTopList, getHeaderHeight } from '../utils';
import './toc.css';

function activeLink(anchorTops, setCurIdx) {
  const scrollTop = window.scrollY;
  let i = anchorTops.findIndex((top) => scrollTop < top);
  if (i < 0) i = anchorTops.length - 1;
  setCurIdx(i);
}

export function Toc() {
  const url = location.href.replace(/https?:\/\//, '');
  if (config.whiteList.every((w) => !url.startsWith(w))) return;

  const [curIdx, setCurIdx] = useState(0);
  const title = useTitle();
  const top = useMemo(getHeaderHeight, [title]);
  const anchorNodes = useMemo(getAnchors, [title]);
  const anchorTops = useMemo(() => getAnchorTopList(anchorNodes, top), [title]);
  const memoActiveLink = useCallback(() => activeLink(anchorTops, setCurIdx), [title]);

  useEffect(() => activeLink(anchorTops, setCurIdx), [title]);
  useEventListener(window, 'scroll', memoActiveLink);

  return (
    <nav className="toc-container" style={{ top: `${top}px` }}>
      <TocHead title={title} />
      <TocBody anchorNodes={anchorNodes} top={top} curIdx={curIdx} setCurIdx={setCurIdx} />
    </nav>
  );
}

/**
 * 1、解决 react官方文档hashchange偶现的DOM定位不准，没有滚动到指定锚点内容区域
 * 2、解决 点击链接跳转到近距离锚点时，定位判断不够精准，出现 toc active状态更新错误
 */
