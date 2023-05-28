import { HEADING_SELECTORS, NODE_NAME, NOISE_SELECTORS, SYMBOL } from '../shared/constants';
import { getDepthAndPath, getFontSize, getLevel, getText } from './dom-util';
import { RectMap, StyleMap } from './heading-all-util';

const MW = 10;
const M1 = window.innerWidth / 3;
const M2 = window.innerWidth / 2;

export function inferHeadings(nodes: HTMLElement[], styleMap: StyleMap, rectMap: RectMap) {
  nodes = filterByStyleRuleP1(nodes, styleMap, rectMap);

  const invalidNodes = filterByScoreRuleP2(nodes, styleMap, rectMap, 0.9);
  const invalidNodeSet = new Set(invalidNodes);
  if (invalidNodeSet.size) nodes = nodes.filter((n) => !invalidNodeSet.has(n));

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
  const FEATS = {
    ID: 'nodeId',
    TAG: 'nodeTag',
    DEPTH: 'nodeDepth',
    PATH: 'nodePath',
    LEFT: 'nodeLeft',
    MID: 'nodeMid',
    WIDTH: 'nodeWidth',
    MX_WIDTH: 'maxWidth',
    FONT_SIZE: 'fontSize',
    FONT_BOLD: 'fontBold',
    RECOMMEND_LINK: 'recommendLink',
    NOISE_PARENT: 'noiseParent',
    ARTICLE_PARENT: 'articleParent',
    DOC_TITLE: 'docTitle',
    LEVEL_BREAK: 'levelBreak',
  };

  const commonStyleFeats: Array<keyof CSSStyleDeclaration> = [
    'display',
    'margin',
    'padding',
    'color',
    'backgroundColor',
    'fontFamily',
  ];

  const SPECIAL_SCORE = {
    [`${FEATS.TAG}-H`]: 3,
    [`${FEATS.ID}-true`]: 3,
    [`${FEATS.FONT_BOLD}-true`]: 3,
    [`${FEATS.LEFT}-true`]: 3,
    [`${FEATS.MID}-true`]: 3,
    [`${FEATS.WIDTH}-true`]: 3,
    [`${FEATS.ARTICLE_PARENT}-true`]: 6,
    [`${FEATS.RECOMMEND_LINK}-true`]: -10,
    [`${FEATS.NOISE_PARENT}-true`]: -10,
    [`${FEATS.DOC_TITLE}-true`]: -10,
    [`${FEATS.LEVEL_BREAK}-true`]: -10,
  };

  const noiseSelector = ['side', 'left', 'right', 'foot', 'comment', 'recommend']
    .map((v) => `[id*=${v}]${SYMBOL.COMMA}[class*=${v}]`)
    .concat(NOISE_SELECTORS)
    .join(SYMBOL.COMMA);

  const maxWidth = Math.min(window.innerWidth / 3, 600);

  const featGroup = new Map<string, number[]>();
  const groupByFeat = (feat: string, val: string | number | boolean, idx: number) => {
    const key = `${feat}-${val.toString()}`;
    if (!featGroup.has(key)) featGroup.set(key, []);
    featGroup.get(key)?.push(idx);
  };

  let h1Count = 0;

  nodes.forEach((node, i) => {
    const valId = node.id || node.getAttribute('name');
    if (valId) groupByFeat(FEATS.ID, true, i);

    const valTag = node.tagName.startsWith('H') ? 'H' : 'B';
    groupByFeat(FEATS.TAG, valTag, i);

    const [valDepth, valPath] = getDepthAndPath(node);
    groupByFeat(FEATS.DEPTH, valDepth, i);
    groupByFeat(FEATS.PATH, valPath, i);

    // document.title 包含该节点完整的文本内容，可能是文章标题
    const text = getText(node);

    if (factor !== 1) {
      groupByFeat(FEATS.DOC_TITLE, !!(text && document.title.includes(text)), i);
      // 唯一的 H1，可能是文章标题（是否附加：top<300？最大的 heading？）
      const H1 = 'H1';
      if (!h1Count && node.tagName === H1) {
        h1Count++;
        const h1Node = nodes.filter((n, j) => j > i && n.tagName === H1);
        if (h1Node) groupByFeat(FEATS.DOC_TITLE, true, i);
      }
    }

    // 不能是推荐链接
    groupByFeat(FEATS.RECOMMEND_LINK, hasRecommendLink(node), i);

    // 节点在文章主体中
    groupByFeat(FEATS.ARTICLE_PARENT, !!node.closest(NODE_NAME.article), i);

    // 在footer、sidebar等节点下
    groupByFeat(FEATS.NOISE_PARENT, !!node.closest(noiseSelector), i);

    // level突变，如 h2 -> h5
    for (let j = i + 1; nodes[j] && getLevel(nodes[j]) - getLevel(node) > 1; j++) {
      groupByFeat(FEATS.LEVEL_BREAK, true, j);
    }

    const rect = rectMap.get(node) || new DOMRect(-1, -1, -1, -1);
    const style = styleMap.get(node) || new CSSStyleDeclaration();

    groupByFeat(FEATS.LEFT, rect.left, i);
    groupByFeat(FEATS.WIDTH, rect.width, i);
    groupByFeat(FEATS.MID, ((rect.left + rect.right) / 2) >> 0, i);
    // width 有最小限制
    if (rect.width >= maxWidth) groupByFeat(FEATS.MX_WIDTH, true, i);

    const fontSize = style ? getFontSize(style) : -1;
    groupByFeat(FEATS.FONT_SIZE, `${node.tagName}-${fontSize}`, i);

    const fontWeight = +(style ? style.fontWeight : -1);
    if (fontWeight > 400) groupByFeat(FEATS.FONT_BOLD, true, i);

    for (const p of commonStyleFeats) {
      groupByFeat(p as string, style[p] as string, i);
    }
  });

  let totalScore = 0;
  const scoreMap = new WeakMap<HTMLElement, number>();

  for (const [key, idxList] of featGroup) {
    const baseScore = SPECIAL_SCORE[key] || 1;

    for (const i of idxList) {
      const n = nodes[i];
      const score = baseScore > 0 ? baseScore * idxList.length : baseScore;
      totalScore += score;
      scoreMap.set(n, (scoreMap.get(n) || 0) + score);
    }
  }

  const avgScore = (totalScore / nodes.length) * factor;

  return nodes.filter((node) => {
    return (scoreMap.get(node) ?? -Infinity) < avgScore;
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
