import { filterOfficialHeadings } from './heading-std-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings } from './heading-all-util';
import { getFontSize, getLevel, getRect, isHeading, isHidden, queryAll } from './dom-util';
import { HEADING_SELECTORS } from '../shared/constants';

export function resolveHeadings() {
  const articleNode = resolveArticle();
  const { hTagHeadings, bTagHeadings, styleHeadings, semanticHeadings, styleMap, rectMap } =
    getAllHeadings(articleNode);

  const officialHeadings = filterOfficialHeadings(hTagHeadings);

  const MIN = 1;
  let inferredHeadings: HTMLElement[] = [];
  if (officialHeadings.length <= MIN) {
    const tagHeadings = mergeHeadings([...hTagHeadings, ...bTagHeadings]);
    const iTagResult = inferHeadings(tagHeadings, styleMap, rectMap);

    const miscHeadings = mergeHeadings([...styleHeadings, ...semanticHeadings]);
    const iMiscResult = inferHeadings(miscHeadings, styleMap, rectMap);

    inferredHeadings = iTagResult.length > MIN ? iTagResult : iMiscResult;
  }

  let allHeadings: HTMLElement[];
  const F = 5;
  if (officialHeadings.length > F) {
    allHeadings = mergeHeadings([...hTagHeadings, ...bTagHeadings]);
  } else {
    allHeadings = mergeHeadings([...hTagHeadings, ...bTagHeadings, ...styleHeadings, ...semanticHeadings]);
  }

  return {
    allHeadings: attachLevel(allHeadings, styleMap),
    officialHeadings: attachLevel(officialHeadings, styleMap),
    inferredHeadings: attachLevel(inferredHeadings, styleMap),
  };
}

function resolveArticle(): HTMLElement {
  const nodes = queryAll('body :not(:is(script,style,svg))');

  let maxLen = 0;
  let mainNode: HTMLElement = document.body;
  const validNodes: HTMLElement[] = [];
  const map: NodeMap = new WeakMap();
  const bodyTextCount = getValidText(document.body).length;
  const bodyRect = getRect(document.body);

  const MAX = 10;
  nodes.forEach((node: HTMLElement) => {
    const textCount = getValidText(node).length;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);

    if (textCount < MAX || isHidden(node, style, rect, bodyRect)) return;

    validNodes.push(node);
    map.set(node, { textCount, rect });

    if (textCount <= maxLen || textCount / bodyTextCount < 0.8) return;

    maxLen = textCount;
    mainNode = node;
  });

  const articleNode = validNodes.findLast((node) => validateArticleNode(node, mainNode, map)) || mainNode;

  if (import.meta.env.DEV) {
    mainNode.style.boxShadow = 'inset blue 0 0 0 10px';
    articleNode.style.boxShadow = 'inset red 0 0 0 10px';
  }

  mainNode.toggleAttribute('onetoc-main', true);
  articleNode.toggleAttribute('onetoc-article', true);

  return articleNode;
}

function validateArticleNode(articleNode: HTMLElement, mainNode: HTMLElement, nodeMap: NodeMap) {
  const info = nodeMap.get(articleNode);
  const mainInfo = nodeMap.get(mainNode);

  if (!info || !mainInfo) return false;
  if (info.rect.top - mainInfo.rect.top > 200) return false;

  const RATE = 0.6;
  const { width: w1, height: h1 } = info.rect;
  const { width: w2, height: h2 } = mainInfo.rect;
  if (info.textCount / mainInfo.textCount < RATE && (w1 * h1) / (w2 * h2) < RATE) return false;

  return mainNode.contains(articleNode);
}

function mergeHeadings(nodes: HTMLElement[]) {
  return nodes
    .sort((a, b) => {
      if (a === b) return 0;
      // Node.DOCUMENT_POSITION_FOLLOWING, Node.DOCUMENT_POSITION_CONTAINED_BY
      return [4, 16].includes(a.compareDocumentPosition(b)) ? -1 : 1;
    })
    .filter((n, i, nodes) => {
      return i === 0 || !(n.contains(nodes[i - 1]) || nodes[i - 1].contains(n));
    });
}

function getValidText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s/g, '');
}

function attachLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>): Heading[] {
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
