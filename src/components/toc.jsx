import React, { useCallback, useMemo, useState } from 'react';
import { config } from '../config';
import { TocHead } from './toc-head';
import { TocBody } from './toc-body';
import { TocIcon } from './toc-icon';
import { useTitle } from './hooks';
import { getHeaderHeight } from '../utils';
import './toc.less';

export function Toc() {
  const url = location.href.replace(/https?:\/\//, '');
  if (config.whiteList.every((w) => !url.startsWith(w))) return;

  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const title = useTitle();
  const top = useMemo(getHeaderHeight, [title]);
  const style = { top: `${top}px`, maxHeight: `calc(100vh - ${top}px - 20px)` };

  return (
    <nav className={'toc-container ' + (expanded ? 'toc-expanded' : '')} style={style}>
      {expanded ? (
        <>
          <TocHead title={title} toggleExpanded={toggleExpanded} />
          <TocBody />
        </>
      ) : (
        <TocIcon toggleExpanded={toggleExpanded} />
      )}
    </nav>
  );
}
