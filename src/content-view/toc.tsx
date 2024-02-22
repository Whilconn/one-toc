import React, { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { TocBody } from './toc-body';
import { useTitle } from './hooks';
import { useHeadings } from './use-headings';
import { useSettings } from './use-settings';
import { useDragResize } from './use-drag-resize';
import { getFixedHeaderHeight } from '../content-utils/header-util';
import { changeLayout } from '../content-utils/layout-util';
import { DEFAULT_SETTINGS, POS_EMBED, saveSettings } from '../extension-utils/settings';

import pkg from '../../package.json';
import closeSvg from '../assets/close.svg?raw';
import './toc.less';
import { Skeleton } from '../shared/skeleton';

export function Toc({ hideToc }: Props) {
  const tocRef = useRef<HTMLElement>(null);
  const title = useTitle();
  const settings = useSettings();
  const top = useMemo(getFixedHeaderHeight, [title]);
  const { loading, headingGroups, group, setGroup } = useHeadings(title, settings);

  const isEmbed = settings?.position === POS_EMBED;

  // onetoc-embed | onetoc-fixed-right | onetoc-fixed-left
  const positionClass = `onetoc-${settings?.position ?? DEFAULT_SETTINGS.position}`;
  const positionStyle: CSSProperties = isEmbed ? {} : { top: `${top}px`, maxHeight: `calc(100vh - ${top}px - 20px)` };

  // 内嵌模式下修改源网页的布局
  useEffect(() => {
    if (!isEmbed) return;

    const restoreLayout = changeLayout();
    return () => restoreLayout();
  }, [isEmbed]);

  // 定位选项变化时，重置因拖拽而改变的样式
  useEffect(() => {
    if (tocRef.current) {
      Object.assign(tocRef.current.style, { transform: null, width: null, height: null });
    }
  }, [settings?.position]);

  function updateKnownVersion() {
    void saveSettings({ ...DEFAULT_SETTINGS, ...settings, knownVersion: pkg.version }).then();
  }

  useDragResize({
    containerSelector: '.onetoc-container',
    dragSelector: '.onetoc-head',
    dragDisabled: isEmbed,
    resizeDisabled: isEmbed,
  });

  if (!settings) return null;

  return (
    <nav ref={tocRef} className={`onetoc-container ${positionClass}`} style={positionStyle} data-theme={settings.theme}>
      <div className="onetoc-head">
        <p className="onetoc-title">
          {headingGroups.map((g, i) => {
            if (!g.headings.length) return null;

            return (
              <a key={g.name} onClick={() => setGroup(i)} className={i === group ? 'active' : ''}>
                {g.name}
                {import.meta.env.DEV && `[${g.headings.length}]`}
                &emsp;
              </a>
            );
          })}
          {headingGroups.every((g) => !g.headings.length) && title}
        </p>

        {pkg.version !== settings.knownVersion ? (
          <a
            className="onetoc-new"
            href="https://github.com/Whilconn/one-toc/releases"
            target="_blank"
            rel="noreferrer"
            onClick={updateKnownVersion}
          >
            NEW
          </a>
        ) : null}

        <span
          onClick={hideToc}
          dangerouslySetInnerHTML={{ __html: closeSvg }}
          className="onetoc-close-icon"
          title="关闭"
        />
      </div>

      {loading ? <Skeleton /> : <TocBody headings={headingGroups[group]?.headings || []} />}
    </nav>
  );
}

type Props = {
  hideToc: () => void;
};
