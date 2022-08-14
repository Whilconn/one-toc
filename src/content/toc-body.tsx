import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SYMBOL } from './constants';
import { useEventListener, useTitle } from './hooks';
import { getAnchors, getAnchorTopList, getHeaderHeight } from './utils';
import './toc-body.less';

export function TocBody() {
  const [current, setCurrent] = useState(0);

  const title = useTitle();
  const top = useMemo(getHeaderHeight, [title]);
  const anchorNodes = useMemo(getAnchors, [title]);
  const anchorTops = useMemo(() => getAnchorTopList(anchorNodes, top), [anchorNodes, top]);

  function activeLink() {
    const scrollTop = window.scrollY;
    let i = anchorTops.findIndex((aTop) => scrollTop < aTop);
    if (i < 0) i = anchorTops.length - 1;
    setCurrent(i);
  }

  useEffect(activeLink, [anchorTops]);
  const memoActiveLink = useCallback(activeLink, [anchorTops]);
  useEventListener(window, 'scroll', memoActiveLink);

  const minLevel = anchorNodes.reduce((min, node) => {
    const level = +node.tagName.replace(/[a-z]/gi, '');
    return Math.min(min, level);
  }, Infinity);

  return (
    <div className="toc-body">
      {anchorNodes.map((node, i) => {
        const text = node.innerText;
        const href = SYMBOL.HASH + node.id;

        // level
        const level = +node.tagName.replace(/[a-z]/gi, '') - minLevel;
        const style = { paddingLeft: `${20 * level}px` };
        const cls = i === current ? 'active' : '';

        return (
          <a key={node.id} onClick={() => setCurrent(i)} href={href} className={cls} style={style} title={text}>
            {text}
          </a>
        );
      })}
      {!anchorNodes.length && <p className="no-content">暂无数据</p>}
    </div>
  );
}
