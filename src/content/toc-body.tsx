import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  // 解决 fixed header 遮挡锚点的问题，配合 scrollByHash 使用
  useEffect(() => {
    const styleHtml = `<style>:target{scroll-margin-top:${top}px;scroll-padding-top:${top}px;}</style>`;
    const styleNode = document.querySelector('style');
    if (styleNode?.outerHTML === styleHtml) return;
    styleNode?.insertAdjacentHTML('beforebegin', styleHtml);
  }, [top]);

  function scrollByHash(node: HTMLElement) {
    window.location.hash = node.id;
  }

  function scrollByTextFragment(node: HTMLElement) {
    window.location.hash = `:~:text=${encodeURIComponent(node.innerText)}`;
  }

  function scrollByForce(node: HTMLElement) {
    const scrollingNode = document.scrollingElement as HTMLElement;
    scrollingNode.style.scrollBehavior = 'auto';
    node.scrollIntoView({ block: 'start' });
    scrollingNode.scrollTop -= top;
  }

  function clickAnchor(i: number, node: HTMLElement) {
    setCurrent(i);
    scrollByHash(node);
    // scrollByForce(node);
    // scrollByTextFragment(node);
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
