import React from 'react';
import closeSvg from '../assets/close.svg?raw';
import './toc-head.less';

interface Props {
  title: string;
  hideToc: () => void;
}

export function TocHead(props: Props) {
  return (
    <div className="toc-head">
      <p className="toc-title" title={props.title}>
        {props.title}
      </p>
      <div
        onClick={props.hideToc}
        dangerouslySetInnerHTML={{ __html: closeSvg }}
        className="toc-close-icon"
        title="关闭"
      />
    </div>
  );
}
