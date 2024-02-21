import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { TocBody } from './toc-body';
import { useTitle } from './hooks';
import { useDragResize } from './use-drag-resize';
import { getFixedHeaderHeight } from '../content-utils/header-util';
import { changeLayout } from '../content-utils/layout-util';
import { DEFAULT_SETTINGS, loadSettings, POS_EMBED, saveSettings, Settings } from '../extension-utils/settings';
import { Heading, resolveHeadings } from '../content-utils/heading-util';
import { matchResolveRule } from '../shared/resolve-rules';
import pkg from '../../package.json';
import closeSvg from '../assets/close.svg?raw';
import './toc.less';

export function Toc({ hideToc }: Props) {
  const tocRef = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState<Settings>();
  const [loading, setLoading] = useState(true);

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

  const [group, setGroup] = useState(0);
  const [headingGroups, setHeadingGroups] = useState<Group[]>([]);
  const { inferredHeadings, allHeadings, officialHeadings } = useMemo(() => {
    if (!settings) return { inferredHeadings: [], allHeadings: [], officialHeadings: [] };

    const resolveRule = matchResolveRule(settings.resolveRules);
    setTimeout(() => {
      resolveHeadings(resolveRule);
      setLoading(false);
    }, 200);

    return { inferredHeadings: [], allHeadings: [], officialHeadings: [] };
  }, [title, settings?.resolveRules]);

  useEffect(() => {
    if (!settings) return;

    const groups = [
      { name: '自带', headings: officialHeadings },
      {
        name: '精选',
        headings: inferredHeadings,
      },
      { name: '所有', headings: allHeadings },
    ];

    // 默认策略不是official时，交换前两个分组位置
    if (settings?.strategy !== DEFAULT_SETTINGS.strategy) {
      [groups[0], groups[1]] = [groups[1], groups[0]];
    }

    // 两组heading相同时，仅保留下标小的分组
    for (let i = groups.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (!groups[i].headings.length || groups[i].headings.length !== groups[j].headings.length) continue;
        if (groups[i].headings.every((h, k) => h.node === groups[j].headings[k].node)) {
          groups[i].headings = [];
        }
      }
    }

    // 优先选中下标小的分组
    if (groups[0].headings.length) setGroup(0);
    else if (groups[1].headings.length) setGroup(1);
    else setGroup(2);

    setHeadingGroups(groups);
  }, [settings, inferredHeadings, allHeadings, officialHeadings]);

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

      {loading ? (
        <center>
          <p>loading...</p>
          <p>loading...</p>
          <p>loading...</p>
          <p>loading...</p>
          <p>loading...</p>
          <p>loading...</p>
        </center>
      ) : (
        <TocBody headings={headingGroups[group]?.headings || []} />
      )}
    </nav>
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

type Group = {
  name: string;
  headings: Heading[];
};
