import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, NODE_NAME, SYMBOL, TOC_LEVEL } from '../shared/constants';
import {
  findAncestor,
  getDepthAndPath,
  getFontSize,
  getLevel,
  getNextNode,
  getPrevNode,
  getRect,
  getText,
  isHeading,
} from './dom-util';

const MW = 10;
const INLINE = 'inline';
const INVALID_DISPLAYS = ['none'];

const WORDS = ['side', 'left', 'right', 'foot', 'title', 'comment'];
const NOISE_SELECTORS = ['header', 'aside', 'footer'];
['id', 'class'].forEach((a) => NOISE_SELECTORS.push(...WORDS.map((w) => `[${a}*=${w}]`)));

export function getAnchors() {
  const selector = [...HEADING_SELECTORS, ...BOLD_SELECTORS].join(SYMBOL.COMMA);

  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];

  // 注意：rectMap与styleMap是全局状态，且存在改变该状态的逻辑，容易产生bug
  const rectMap = new WeakMap<HTMLElement, DOMRect>();
  const styleMap = new WeakMap<HTMLElement, CSSStyleDeclaration>();

  for (const node of nodes) {
    rectMap.set(node, getRect(node));
    styleMap.set(node, getComputedStyle(node));
  }

  nodes = filterBasic(nodes, styleMap, rectMap);
  nodes = filterByScore(nodes, styleMap, rectMap);

  markIdAndLevel(nodes, styleMap);

  return nodes;
}

function isOneLine(node: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect) {
  if (isHeading(node) || !rect || !style?.display.includes(INLINE)) return true;

  // 非 h1~h6 的节点，必须独占一行
  const prevNode = getPrevNode(node);
  const nextNode = getNextNode(node);

  const y1 = prevNode ? getRect(prevNode).bottom : -Infinity;
  const y2 = nextNode ? getRect(nextNode).top : Infinity;

  const BREAK = '\n';
  const prevText = prevNode?.textContent || '';
  const nextText = nextNode?.textContent || '';

  return (y1 <= rect.top || prevText.endsWith(BREAK)) && (rect.bottom <= y2 || nextText.startsWith(BREAK));
}

function hasContent(n1: HTMLElement, n2: HTMLElement, styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  if (!n1 || !n2 || getLevel(n1) < getLevel(n2)) return true;

  const s1 = styleMap.get(n1);
  const s2 = styleMap.get(n2);
  if (!s1 || !s2 || getFontSize(s1) > getFontSize(s2)) return true;

  const range = new Range();
  range.setStartAfter(n1);
  range.setEndBefore(n2);
  const { width, height } = range.getBoundingClientRect();
  return width > MW && height > MW;
}

// 是否推荐链接
function isRecommendLink(node: HTMLElement) {
  const recommendLink = (node.closest(NODE_NAME.a) || node.querySelector(NODE_NAME.a)) as HTMLAnchorElement;
  const path = location.origin + location.pathname;
  return recommendLink?.href && !recommendLink.href.startsWith(path);
}

// 修改计算后的布局信息（直接修改节点样式会导致页面布局改变甚至破坏）
function updateRect(
  node: HTMLElement,
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const rect = rectMap.get(node);
  const style = styleMap.get(node);
  if (!style || !rect) return;

  const ancestor = findAncestor(node, (n) => {
    return !getComputedStyle(n).display.includes(INLINE);
  });

  if (!ancestor) return;

  const ar = ancestor.getBoundingClientRect();
  rect.x = ar.x;
  rect.width = ar.width;

  if (import.meta.env.DEV) console.debug('修改节点styleMap、rectMap', node);
}

function filterBasic(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const MIN_FS = 14;
  const M1 = window.innerWidth / 3;
  const M2 = window.innerWidth / 2;
  const headSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);

  return nodes.filter((node, i) => {
    // 没有文字
    if (!getText(node)) return false;

    // 祖先节点有h1~h6
    if (node?.parentElement?.closest(headSelector)) return false;

    const rect = rectMap.get(node);
    const style = styleMap.get(node);
    if (!style || !rect) return true;

    // 宽高不小于 10px
    if (Math.min(rect.width, rect.height) < MW) return false;

    // 字号不小于 14px 的
    if (getFontSize(style) < MIN_FS) return false;

    // 剔除隐藏节点、fixed节点
    if (INVALID_DISPLAYS.includes(style.display) || FIXED_POSITIONS.includes(style.position)) return false;

    // 标题之间必须有内容
    if (!hasContent(node, nodes[i + 1], styleMap)) return false;

    // 必须独占一行
    if (!isOneLine(node, style, rect)) return false;

    // 剔除推荐链接
    if (isRecommendLink(node)) return false;

    updateRect(node, styleMap, rectMap);

    // 横跨三分轴或中轴
    if (M2 < rect.left || M1 > rect.right) return false;

    // 剔除与相邻标题的 top 或 bottom 相等的节点
    return ![nodes[i - 1], nodes[i + 1]].some((n) => {
      const r = rectMap.get(n);
      return r?.top === rect.top || r?.bottom === rect.bottom;
    });
  });
}

function getDiffFeats(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  const feats = ['display', 'margin', 'padding', 'color', 'background-color', 'font-family'];
  const sets = feats.map(() => new Set());
  for (const node of nodes) {
    const style = styleMap.get(node);
    for (const [i, p] of feats.entries()) {
      const val = style?.getPropertyValue(p);
      if (val) sets[i].add(val);
    }
  }

  return feats.filter((p, i) => sets[i].size > 1);
}

function filterByScore(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
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
    NOISE_NODE: 'noiseNode',
    NOISE_PARENT: 'noiseParent',
    DOC_TITLE: 'docTitle',
    LEVEL_BREAK: 'levelBreak',
  };

  const BASE_SCORE = {
    [`${FEATS.TAG}-H`]: 3,
    [`${FEATS.ID}-true`]: 3,
    [`${FEATS.FONT_BOLD}-true`]: 3,
    [`${FEATS.NOISE_NODE}-true`]: -10,
    [`${FEATS.NOISE_PARENT}-true`]: -10,
    [`${FEATS.DOC_TITLE}-true`]: -10,
    [`${FEATS.LEVEL_BREAK}-true`]: -10,
  };

  const maxWidth = Math.min(window.innerWidth / 3, 600);
  const noiseSelector = NOISE_SELECTORS.join(SYMBOL.COMMA);

  const featIdxMap = new Map<string, number[]>();
  const addFeatIdx = (feat: string, val: string | number | boolean, idx: number) => {
    const key = `${feat}-${val.toString()}`;
    featIdxMap.has(key) ? featIdxMap.get(key)?.push(idx) : featIdxMap.set(key, [idx]);
  };

  const styleFeats = getDiffFeats(nodes, styleMap);

  let h1Count = 0;

  nodes.forEach((node, i) => {
    const valId = node.id || node.getAttribute('name');
    if (valId) addFeatIdx(FEATS.ID, true, i);

    const valTag = node.tagName.startsWith('H') ? 'H' : 'B';
    addFeatIdx(FEATS.TAG, valTag, i);

    const [valDepth, valPath] = getDepthAndPath(node);
    addFeatIdx(FEATS.DEPTH, valDepth, i);
    addFeatIdx(FEATS.PATH, valPath, i);

    // document.title 包含该节点完整的文本内容，可能是文章标题
    const text = getText(node);
    addFeatIdx(FEATS.DOC_TITLE, !!(text && document.title.includes(text)), i);
    // 唯一的 H1，可能是文章标题（是否附加：top<300？最大的 heading？）
    const H1 = 'H1';
    if (!h1Count && node.tagName === H1) {
      h1Count++;
      const h1Node = nodes.filter((n, j) => j > i && n.tagName === H1);
      if (h1Node) addFeatIdx(FEATS.DOC_TITLE, true, i);
    }

    // 包含特殊标点符号
    const reg = /[,，；;。]|\.$/;
    if (reg.test(text)) addFeatIdx(FEATS.NOISE_NODE, true, i);
    // 节点不在文章主体中，如footer、sidebar等
    addFeatIdx(FEATS.NOISE_NODE, node.matches(noiseSelector), i);
    addFeatIdx(FEATS.NOISE_PARENT, !!node.closest(noiseSelector), i);

    // level突变，如 h2 -> h5
    for (let j = i + 1; nodes[j] && getLevel(nodes[j]) - getLevel(node) > 1; j++) {
      addFeatIdx(FEATS.LEVEL_BREAK, true, j);
    }

    const rect = rectMap.get(node) || new DOMRect(-1, -1, -1, -1);
    const style = styleMap.get(node);

    addFeatIdx(FEATS.LEFT, rect.left, i);
    addFeatIdx(FEATS.WIDTH, rect.width, i);
    addFeatIdx(FEATS.MID, ((rect.left + rect.right) / 2) >> 0, i);
    // width 有最小限制
    if (rect.width >= maxWidth) addFeatIdx(FEATS.MX_WIDTH, true, i);

    const fontSize = style ? getFontSize(style) : -1;
    addFeatIdx(FEATS.FONT_SIZE, `${node.tagName}-` + fontSize.toString(), i);

    const fontWeight = +(style ? style.fontWeight : -1);
    if (fontWeight > 400) addFeatIdx(FEATS.FONT_BOLD, true, i);

    for (const p of styleFeats) {
      addFeatIdx(p, style?.getPropertyValue(p) as string, i);
    }
  });

  let totalScore = 0;
  const scoreMap = new WeakMap<HTMLElement, number>();

  for (const [key, idxList] of featIdxMap) {
    const baseScore = BASE_SCORE[key] || 1;

    for (const i of idxList) {
      const n = nodes[i];
      const score = baseScore > 0 ? baseScore * idxList.length : baseScore;
      totalScore += score;
      scoreMap.set(n, (scoreMap.get(n) || 0) + score);
    }
  }

  const avgScore = (totalScore / nodes.length) * 0.9;

  return nodes.filter((node) => {
    return (scoreMap.get(node) || -Infinity) >= avgScore;
  });
}

function markIdAndLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  // 记录所有字号
  const sizeSet = nodes.reduce((set, node) => {
    const style = styleMap.get(node);
    const fontSize = style ? getFontSize(style) : -1;
    return set.add(fontSize);
  }, new Set<number>());

  // 字号过滤、排序、截取
  const sizeArr = [...sizeSet]
    .filter((s) => s > 0)
    .sort((a, b) => b - a)
    .slice(0, HEADING_SELECTORS.length);

  nodes.forEach((node, i) => {
    // 标记 id
    node.id = node.id || `onetoc-anchor-${i}`;

    const style = styleMap.get(node);
    if (!style) return;

    // 标记 level
    const l = sizeArr.indexOf(getFontSize(style)) + (isHeading(node) ? 0 : 1);
    if (l >= 0) node.setAttribute(TOC_LEVEL, l.toString());
  });
}

// array to tree: tested
// function groupByLevel(nodes: HTMLElement[]) {
//   let group: Heading[] = [];
//   const groups = [group];
//
//   for (let i = 0; i < nodes.length; i++) {
//     const heading = new Heading(nodes[i]);
//
//     if (!group.length) {
//       group.push(heading);
//       continue;
//     }
//
//     const n1 = group[group.length - 1];
//     const l1 = +(n1.node.getAttribute(TOC_LEVEL) || 0);
//     const l2 = +(heading.node.getAttribute(TOC_LEVEL) || 0);
//
//     if (l1 === l2) group.push(heading);
//     else if (l1 > l2) {
//       groups.pop();
//       group = groups[groups.length - 1];
//       i--;
//     } else {
//       group = n1.children;
//       group.push(heading);
//       groups.push(group);
//     }
//   }
//
//   return groups[0];
// }
//
// class Heading {
//   node: HTMLElement;
//   children: Heading[] = [];
//
//   constructor(node: HTMLElement) {
//     this.node = node;
//   }
// }
