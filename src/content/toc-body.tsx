import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useEventListener, useTitle } from './hooks';
import { getAnchors, getAnchorTopList } from '../utils/anchor-util';
import { getFixedHeaderHeight } from '../utils/header-util';
import { scrollByApi } from '../utils/scroll-util';
import './toc-body.less';

export function TocBody() {
  const [current, setCurrent] = useState(0);
  const [top, setTop] = useState(0);

  const title = useTitle();
  const anchorNodes = useMemo(getAnchors, [title]);
  const anchorTops = useMemo(() => getAnchorTopList(anchorNodes, top), [anchorNodes, top]);
  useEffect(() => {
    setTop(getFixedHeaderHeight());
  }, [title]);

  function activeLink() {
    const scrollTop = window.scrollY;
    let i = anchorTops.findIndex((aTop) => scrollTop < aTop);
    if (i < 0) i = anchorTops.length - 1;
    setCurrent(i);
  }

  useEffect(activeLink, [anchorTops]);
  const memoActiveLink = useCallback(activeLink, [anchorTops]);
  useEventListener(window, 'scroll', memoActiveLink);

  function clickAnchor(i: number, anchorNode: HTMLElement) {
    setCurrent(i);
    const newTop = getFixedHeaderHeight();
    setTop(newTop);
    // scrollByHash(anchorNode, newTop);
    scrollByApi(anchorNode, Math.max(top, newTop));
  }

  const minLevel = anchorNodes.reduce((min, node) => {
    const level = +node.tagName.replace(/[a-z]/gi, '');
    return Math.min(min, level);
  }, Infinity);

  return (
    <div className="toc-body">
      {anchorNodes.map((node, i) => {
        const text = node.innerText;

        // level
        const level = +node.tagName.replace(/[a-z]/gi, '') - minLevel;
        const style = { paddingLeft: `${20 * level}px` };
        const cls = i === current ? 'active' : '';

        return (
          <a key={node.id} onClick={() => clickAnchor(i, node)} className={cls} style={style} title={text}>
            {text}
          </a>
        );
      })}
      {!anchorNodes.length && <p className="no-content">暂无数据</p>}
    </div>
  );
}
