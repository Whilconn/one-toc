import { filterOfficialHeadings } from './heading-std-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings, Styles } from './heading-all-util';
import { getFontSize, getLevel, isHeading, queryAll } from './dom-util';
import { HEADING_SELECTORS } from '../shared/constants';

export function resolveHeadings() {
  const { allHeadings, styleMap, rectMap } = getAllHeadings();
  const articleNode = resolveArticle();
  const allArticleHeadings = allHeadings.filter((n) => articleNode.contains(n));

  const officialHeadings = filterOfficialHeadings(allArticleHeadings);
  const inferredHeadings = inferHeadings(allArticleHeadings, styleMap, rectMap);

  return {
    allHeadings: attachLevel(allArticleHeadings, styleMap),
    officialHeadings: attachLevel(officialHeadings, styleMap),
    inferredHeadings: attachLevel(inferredHeadings, styleMap),
  };
}

function resolveArticle(): HTMLElement {
  const nodes = queryAll('body :not(:is(script, style,svg))');

  let maxLen = 0;
  let mainNode: HTMLElement = document.body;
  const validNodes: HTMLElement[] = [];
  const map: NodeMap = new WeakMap();
  const bodyTextCount = getValidText(document.body).length;

  nodes.forEach((node: HTMLElement) => {
    const textCount = getValidText(node).length;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);

    if (textCount < 10 || rect.width < 10 || rect.height < 10 || /^(none|inline)/.test(style.display)) return;

    validNodes.push(node);
    map.set(node, { textCount, rect });

    if (textCount <= maxLen || textCount / bodyTextCount < 0.8) return;

    maxLen = textCount;
    mainNode = node;
  });

  const articleNode =
    validNodes.findLast((node) => {
      const info = map.get(node);
      const mainInfo = map.get(mainNode);

      if (!info || !mainInfo) return false;
      if (info.rect.top - mainInfo.rect.top > 200) return false;

      const { width: w1, height: h1 } = info.rect;
      const { width: w2, height: h2 } = mainInfo.rect;
      if (info.textCount / mainInfo.textCount < 0.6 && (w1 * h1) / (w2 * h2) < 0.6) return false;

      return mainNode.contains(node);
    }) || mainNode;

  if (import.meta.env.DEV) {
    mainNode.style.boxShadow = 'inset blue 0 0 0 10px';
    articleNode.style.boxShadow = 'inset red 0 0 0 10px';
  }

  mainNode.toggleAttribute('onetoc-main', true);
  articleNode.toggleAttribute('onetoc-article', true);

  return articleNode;
}

function getValidText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s/g, '');
}

function attachLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, Styles>): Heading[] {
  let minLevel = Infinity;
  let maxFontSize = -Infinity;
  const nodeLevels: NodeLevel[] = nodes.map((node): NodeLevel => {
    const style = styleMap.get(node);
    const fontsize = style ? getFontSize(style) : -1;
    const h = isHeading(node);
    const level = h ? getLevel(node) : Infinity;

    minLevel = Math.min(level, minLevel);
    maxFontSize = Math.max(fontsize, maxFontSize);

    return { node, fontsize, level, isHeading: h };
  });

  const hasHeading = minLevel < HEADING_SELECTORS.length;
  if (!hasHeading) minLevel = 0;

  const stack: Omit<NodeLevel, 'node'>[] = [{ fontsize: maxFontSize, level: minLevel, isHeading: hasHeading }];
  return nodeLevels.map(({ node, fontsize, level, isHeading }): Heading => {
    let computedLevel = HEADING_SELECTORS.length;

    while (stack.length) {
      const st = stack[stack.length - 1];

      if (isHeading) {
        computedLevel = level - minLevel;
        if (st.level <= level) break;
      } else {
        const isParent = st.isHeading || st.fontsize > fontsize;
        computedLevel = st.level + (isParent ? 1 : 0);
        if (isParent || st.fontsize === fontsize) break;
      }

      stack.pop();
    }

    stack.push({ fontsize, isHeading, level: computedLevel });

    return { node, level: computedLevel };
  });
}

type NodeMap = WeakMap<HTMLElement, { textCount: number; rect: DOMRect }>;

type NodeLevel = { node: HTMLElement; fontsize: number; isHeading: boolean; level: number };

export type Heading = Pick<NodeLevel, 'node' | 'level'>;
