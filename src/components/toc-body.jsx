import React from 'react';
import { SYMBOL } from '../constants';

export function TocBody(props) {
  const linkNodes = props.anchorNodes.map((node, i) => {
    const text = node.innerText;
    const href = SYMBOL.HASH + node.id;

    // level
    const level = +node.tagName.replace(/[a-z]/gi, '') - 2;
    const style = { paddingLeft: `${20 * level}px` };
    const cls = i === props.curIdx ? 'active' : '';

    return (
      <a onClick={() => props.setCurIdx(i)} href={href} className={cls} style={style} title={text}>
        {text}
      </a>
    );
  });

  const style = { maxHeight: `calc(100vh - ${props.top}px - 100px)` };

  return (
    <div className="toc-body" style={style}>
      {props.anchorNodes.length ? linkNodes : <p className="no-content">暂无数据</p>}
    </div>
  );
}
