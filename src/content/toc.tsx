import React, { useCallback, useMemo, useState } from 'react';
import { TocHead } from './toc-head';
import { TocBody } from './toc-body';
import { TocIcon } from './toc-icon';
import { useTitle } from './hooks';
import { getHeaderHeight } from './utils';
import { useSettings } from '../popup/use-settings';
import * as micromatch from 'micromatch';
import './toc.less';

export function Toc() {
  const [settings] = useSettings();
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const title = useTitle();
  const top = useMemo(getHeaderHeight, [title]);

  if (!settings.enabled || !settings.whitelist) return null;

  const url = location.host + location.pathname;
  const whitelist = settings.whitelist
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s);

  if (!whitelist.length || !micromatch.some(url, whitelist)) return null;

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
