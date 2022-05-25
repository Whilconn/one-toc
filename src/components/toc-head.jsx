import React from 'react';

export function TocHead(props) {
  return (
    <p className="toc-title" title={props.title}>
      {props.title}
    </p>
  );
}
