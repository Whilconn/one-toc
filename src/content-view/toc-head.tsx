import React from 'react';
import closeSvg from '../assets/close.svg?raw';
import './toc-head.less';

interface Props {
  title: string;
  hideToc: () => void;
}

export function TocHead(props: Props) {
  return (
    <div className="onetoc-head">
      <p className="onetoc-title" title={props.title}>
        {props.title}
      </p>
      <div
        onClick={props.hideToc}
        dangerouslySetInnerHTML={{ __html: closeSvg }}
        className="onetoc-close-icon"
        title="关闭"
      />
    </div>
  );
}
