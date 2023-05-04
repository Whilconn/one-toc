import { filterOfficialHeadings } from './heading-std-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings, Styles } from './heading-all-util';
import { getFontSize, isHeading, queryAll } from './dom-util';
import { HEADING_SELECTORS } from '../shared/constants';

export function resolveHeadings() {
  const { allHeadings, styleMap, rectMap } = getAllHeadings();
  const officialHeadings = filterOfficialHeadings(allHeadings);

  const articleNode = resolveArticle();
  const articleHeadings = allHeadings.filter((n) => articleNode.contains(n));
  const inferredHeadings = inferHeadings(articleHeadings, styleMap, rectMap);

  return {
    allHeadings: attachLevel(allHeadings, styleMap),
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
  // 记录所有字号
  const sizeSet = nodes.reduce((set, node) => {
    const style = styleMap.get(node);
    const size = style ? +style.fontWeight * getFontSize(style) : -1;
    return set.add(size);
  }, new Set<number>());

  // 字号过滤、排序、截取
  const sizeArr = [...sizeSet]
    .filter((s) => s > 0)
    .sort((a, b) => b - a)
    .slice(0, HEADING_SELECTORS.length);

  return nodes.map((node) => {
    const style = styleMap.get(node);

    const size = style ? +style.fontWeight * getFontSize(style) : -1;
    const index = sizeArr.findIndex((s) => size >= s);

    // 计算 level
    const level = (index >= 0 ? index : sizeArr.length) + (isHeading(node) ? 0 : 1);
    return { node, level };
  });
}

type NodeMap = WeakMap<HTMLElement, { textCount: number; rect: DOMRect }>;

export type Heading = { node: HTMLElement; level: number };
