import React from 'react';
import TocSvg from '../assets/toc.svg?raw';
import './toc-icon.less';

export function TocIcon(props) {
  return (
    <span
      onClick={props.toggleExpanded}
      dangerouslySetInnerHTML={{ __html: TocSvg }}
      className="toc-expand-icon"
      title="展开"
    />
  );
}
