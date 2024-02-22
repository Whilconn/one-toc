import { useEffect, useState } from 'react';
import { matchResolveRule } from '../shared/resolve-rules';
import { Heading, resolveHeadings } from '../content-utils/heading-util';
import { DEFAULT_SETTINGS, Settings } from '../extension-utils/settings';

function groupHeadings(
  settings: Settings,
  inferredHeadings: Heading[],
  allHeadings: Heading[],
  officialHeadings: Heading[],
): Group[] {
  const groups: Group[] = [
    { name: '自带', headings: officialHeadings },
    {
      name: '精选',
      headings: inferredHeadings,
    },
    { name: '所有', headings: allHeadings },
  ];

  // 默认策略不是official时，交换前两个分组位置
  if (settings.strategy !== DEFAULT_SETTINGS.strategy) {
    [groups[0], groups[1]] = [groups[1], groups[0]];
  }

  // 两组heading相同时，仅保留下标小的分组
  for (let i = groups.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      const gr = groups[i];
      const gl = groups[j];
      if (!gr.headings.length || gr.headings.length !== gl.headings.length) continue;

      if (gr.headings.every((h, k) => h.node === gl.headings[k].node)) {
        gr.headings = [];
      }
    }
  }

  return groups;
}

export function useHeadings(title: string, settings: Settings | null) {
  const [loading, setLoading] = useState<boolean>(true);
  const [titleChanged, setTitleChanged] = useState<boolean>(true);

  const [group, setGroup] = useState<number>(0);
  const [headingGroups, setHeadingGroups] = useState<Group[]>([]);

  useEffect(() => {
    setTitleChanged(true);
  }, [title]);

  useEffect(() => {
    // settings加载成功 或 title变化 才会触发文档解析动作
    const changed = settings && titleChanged;
    if (!changed) return;

    // requestIdleCallback 优化JS长任务（resolveHeadings）阻塞 React 渲染问题
    requestIdleCallback(() => {
      setLoading(true);
      setTitleChanged(false);

      const resolveRule = matchResolveRule(settings.resolveRules);
      const { inferredHeadings, allHeadings, officialHeadings } = resolveHeadings(resolveRule);

      const groups = groupHeadings(settings, inferredHeadings, allHeadings, officialHeadings);

      // 优先选中下标小的分组
      if (groups[0].headings.length) setGroup(0);
      else if (groups[1].headings.length) setGroup(1);
      else setGroup(2);

      setHeadingGroups(groups);
      setLoading(false);
    });
  }, [title, titleChanged, settings]);

  return { loading, headingGroups, group, setGroup };
}

type Group = {
  name: string;
  headings: Heading[];
};
