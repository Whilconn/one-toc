import { BOLD_SELECTORS, HEADING_SELECTORS, NODE_NAME, NOISE_SELECTORS, SYMBOL } from '../shared/constants';
import { getDepthAndPath, getFontSize, getLevel, getText } from './dom-util';
import { RectMap, StyleMap } from './heading-all-util';

const MW = 10;
const M1 = window.innerWidth / 3;
const M2 = window.innerWidth / 2;

export function inferHeadings(nodes: HTMLElement[], styleMap: StyleMap, rectMap: RectMap) {
  nodes = filterByStyleRuleP1(nodes, styleMap, rectMap);
  nodes = filterByScoreRuleP2(nodes, styleMap, rectMap, 0.9);

  return nodes;
}

function filterByStyleRuleP1(nodes: HTMLElement[], styleMap: StyleMap, rectMap: RectMap) {
  let top = -Infinity;

  return nodes.filter((node, i) => {
    const rect = rectMap.get(node);
    const style = styleMap.get(node);
    if (!style || !rect) return true;

    // 标题之间必须有内容
    if (!hasContent(node, nodes[i + 1], styleMap)) return false;

    // 横跨三分轴或中轴
    if (M2 < rect.left || M1 > rect.right) return false;

    // 逻辑与视觉上的前后不能冲突，TODO:需要测试
    if (rect.top < top) return false;
    top = rect.top;

    // 剔除与相邻标题的 top 或 bottom 相等的节点
    const hasParallelNode = [nodes[i - 1], nodes[i + 1]].some((n) => {
      const r = rectMap.get(n);
      return r?.top === rect.top || r?.bottom === rect.bottom;
    });

    return !hasParallelNode;
  });
}

function filterByScoreRuleP2(nodes: HTMLElement[], styleMap: StyleMap, rectMap: RectMap, factor: number) {
  const SCORES = {
    DEPTH: 1,
    PATH: 1,
    ID: 3,
    TAG_H: 3,
    TAG_B: 2,
    LEFT: 1,
    MID: 1,
    WIDTH: 1,
    MX_WIDTH: 3,
    FONT_SIZE: 3,
    FONT_BOLD: 3,
    ARTICLE_PARENT: 6,
    RECOMMEND_LINK: -10,
    NOISE_PARENT: -10,
    DOC_TITLE: -20,
  };

  const FEATS = Object.fromEntries(Object.keys(SCORES).map((k) => [k, k])) as Record<keyof typeof SCORES, string>;

  const commonStyleFeats: Array<keyof CSSStyleDeclaration> = [
    'display',
    'margin',
    'padding',
    'color',
    'backgroundColor',
    'fontFamily',
  ];

  const noiseSelector = ['side', 'left', 'right', 'foot', 'comment', 'recommend']
    .map((v) => `[id*=${v}]${SYMBOL.COMMA}[class*=${v}]`)
    .concat(NOISE_SELECTORS)
    .join(SYMBOL.COMMA);

  const maxWidth = Math.min(window.innerWidth / 3, 600);

  const featGroup = new Map<string, number[]>();
  const groupByFeat = (feat: string, idx: number, val?: string | number) => {
    val = (val ?? '').toString();
    const key = val ? `${feat}-${val}` : feat;
    if (!featGroup.has(key)) featGroup.set(key, []);
    featGroup.get(key)?.push(idx);
  };

  nodes.forEach((node, i) => {
    const valId = node.id || node.getAttribute('name');
    if (valId) groupByFeat(FEATS.ID, i);

    const lowerName = node.tagName.toLowerCase();
    if (HEADING_SELECTORS.includes(lowerName)) groupByFeat(FEATS.TAG_H, i);
    if (BOLD_SELECTORS.includes(lowerName)) groupByFeat(FEATS.TAG_B, i);

    const [valDepth, valPath] = getDepthAndPath(node);
    groupByFeat(FEATS.DEPTH, i, valDepth);
    groupByFeat(FEATS.PATH, i, valPath);

    // document.title 包含该节点完整的文本内容，且该节点是 H1，则可以剔除
    const text = getText(node);
    const H1 = NODE_NAME.h1.toUpperCase();
    if (text && document.title.includes(text) && node.tagName === H1) {
      groupByFeat(FEATS.DOC_TITLE, i);
    }

    // 不能是推荐链接
    if (hasRecommendLink(node)) groupByFeat(FEATS.RECOMMEND_LINK, i);

    // 节点在文章主体中
    if (node.closest(NODE_NAME.article)) groupByFeat(FEATS.ARTICLE_PARENT, i);

    // 在footer、sidebar等节点下
    if (node.closest(noiseSelector)) groupByFeat(FEATS.NOISE_PARENT, i);

    const rect = rectMap.get(node) || new DOMRect(-1, -1, -1, -1);
    const style = styleMap.get(node) || new CSSStyleDeclaration();

    groupByFeat(FEATS.LEFT, i, rect.left >> 0);
    groupByFeat(FEATS.WIDTH, i, rect.width >> 0);
    groupByFeat(FEATS.MID, i, ((rect.left + rect.right) / 2) >> 0);
    // width 有最小限制
    if (rect.width >= maxWidth) groupByFeat(FEATS.MX_WIDTH, i);

    const fontSize = style ? getFontSize(style) : -1;
    // 辅助排除字号异常节点，比如文章标题
    groupByFeat(FEATS.FONT_SIZE, i, fontSize);

    const fontWeight = +(style ? style.fontWeight : -1);
    if (fontWeight >= 500) groupByFeat(FEATS.FONT_BOLD, i);

    for (const p of commonStyleFeats) {
      groupByFeat(p as string, i, style[p] as string);
    }
  });

  let totalScore = 0;
  const scoreMap = new WeakMap<HTMLElement, number>();

  for (const [key, idxList] of featGroup) {
    const baseScore = SCORES[key as keyof typeof SCORES] || 1;

    for (const i of idxList) {
      const n = nodes[i];
      const score = baseScore > 0 ? baseScore * idxList.length : baseScore;
      totalScore += score;
      scoreMap.set(n, (scoreMap.get(n) || 0) + score);
    }
  }

  const avgScore = (totalScore / nodes.length) * factor;

  return nodes.filter((node) => {
    return (scoreMap.get(node) ?? -Infinity) >= avgScore;
  });
}

// 是否推荐链接
function hasRecommendLink(node: HTMLElement) {
  // TODO: https://en.wikipedia.org/wiki/International_Olympic_Committee
  const linkNode = (node.closest(NODE_NAME.a) || node.querySelector(NODE_NAME.a)) as HTMLAnchorElement;

  // a标签与页面 origin 相同，才可能是推荐链接
  if (linkNode?.origin !== location.origin) return false;

  // 剔除出自文章内部的链接
  return !linkNode?.pathname.startsWith(location.pathname);
}

function hasContent(n1: HTMLElement, n2: HTMLElement, styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  // 两个heading必须都存在
  if (!n1 || !n2) return true;

  // 两个都是h1~h6可忽略，n2的层级更大可忽略
  const l1 = getLevel(n1);
  const l2 = getLevel(n2);
  if (Math.max(l1, l2) <= HEADING_SELECTORS.length || l1 < l2) return true;

  // 样式上n1的字号更大可忽略
  const s1 = styleMap.get(n1);
  const s2 = styleMap.get(n2);
  if (!s1 || !s2 || getFontSize(s1) > getFontSize(s2)) return true;

  const range = new Range();
  range.setStartAfter(n1);
  range.setEndBefore(n2);
  const { width, height } = range.getBoundingClientRect();
  return width > MW && height > MW;
}
