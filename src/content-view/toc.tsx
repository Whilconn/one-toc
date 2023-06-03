import React, { useEffect, useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { TocBody } from './toc-body';
import { useTitle } from './hooks';
import { getFixedHeaderHeight } from '../content-utils/header-util';
import { changeLayout } from '../content-utils/layout-util';
import { DEFAULT_SETTINGS, loadSettings, POS_EMBED, saveSettings, Settings } from '../extension-utils/settings';
import { Heading, resolveHeadings } from '../content-utils/heading-util';
import pkg from '../../package.json';
import closeSvg from '../assets/close.svg?raw';
import './toc.less';

export function Toc({ hideToc }: Props) {
  const dragRef = useRef(null);

  const [settings, setSettings] = useState<Settings>();

  // 初始化获取配置，页面切换获取最新配置
  useEffect(() => {
    const eventName = 'visibilitychange';
    const handler = () => {
      void loadSettings().then((st) => {
        setSettings((prevSt) => {
          return equals(prevSt, st) ? prevSt : st;
        });
      });
    };
    handler();
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, []);

  const isEmbed = settings?.position === POS_EMBED;

  const title = useTitle();
  const top = useMemo(getFixedHeaderHeight, [title]);
  const style = isEmbed ? {} : { top: `${top}px`, maxHeight: `calc(100vh - ${top}px - 20px)` };

  // 内嵌模式下修改源网页的布局
  useEffect(() => {
    if (!isEmbed) return;

    const restoreLayout = changeLayout();
    return () => restoreLayout();
  }, [isEmbed]);

  const [group, setGroup] = useState(0);
  const [headingGroups, setHeadingGroups] = useState<Heading[][]>([]);
  const headingNames = ['自带', '精选', '所有'];

  useEffect(() => {
    const { inferredHeadings, allHeadings, officialHeadings } = resolveHeadings();
    const groups = [officialHeadings, inferredHeadings, allHeadings];

    // 两组heading相同时，仅保留下标小的分组
    for (let i = groups.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (!groups[i].length || groups[i].length !== groups[j].length) continue;
        if (groups[i].every((h, k) => h.node === groups[j][k].node)) {
          groups[i] = [];
        }
      }
    }

    // 优先选中下标小的分组
    if (groups[0].length) setGroup(0);
    else if (groups[1].length) setGroup(1);
    else setGroup(2);

    setHeadingGroups(groups);
  }, [title]);

  function updateKnownVersion() {
    void saveSettings({ ...DEFAULT_SETTINGS, ...settings, knownVersion: pkg.version }).then();
  }

  if (!settings) return null;

  return (
    <Draggable nodeRef={dragRef} disabled={isEmbed} bounds="html" cancel=".onetoc-body">
      <nav
        ref={dragRef}
        className={`onetoc-container ${isEmbed ? 'onetoc-embed no-drag' : ''}`}
        style={style}
        data-theme={settings.theme}
      >
        <div className="onetoc-head">
          <p className="onetoc-title">
            {headingNames.map((n, i) => {
              if (!headingGroups[i].length) return null;
              return (
                <a key={n} onClick={() => setGroup(i)} className={i === group ? 'active' : ''}>
                  {n}
                  {import.meta.env.DEV && `[${headingGroups[i].length}]`}
                  &emsp;
                </a>
              );
            })}
            {headingGroups.every((g) => !g.length) && title}
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

        <TocBody headings={headingGroups[group]} />
      </nav>
    </Draggable>
  );
}

// 浅比较
function equals(a: object | undefined | null, b: object | undefined | null) {
  if (a === b) return true;
  return a && b && Object.entries(a).flat().join() === Object.entries(b).flat().join();
}

type Props = {
  hideToc: () => void;
};
