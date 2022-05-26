import React from 'react';
import CollapseSvg from '../assets/collapse.svg?raw';
import './toc-head.less';

export function TocHead(props) {
  return (
    <div className="toc-head">
      <p className="toc-title" title={props.title}>
        {props.title}
      </p>
      <div
        onClick={props.toggleExpanded}
        dangerouslySetInnerHTML={{ __html: CollapseSvg }}
        className="toc-collapse-icon"
        title="收起"
      />
    </div>
  );
}
