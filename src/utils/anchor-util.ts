import { BOLD_SELECTORS, FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL, TOC_LEVEL } from '../shared/constants';
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

const WORDS = ['side', 'left', 'right', 'foot', 'title', 'comment', 'recommend'];
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
  // nodes = filterByTitle(nodes, rectMap);
  nodes = filterByScore(nodes, styleMap, rectMap);

  markLevel(nodes, styleMap);
  markId(nodes);

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

// 仅修改计算后的样式信息和布局信息（直接修改节点样式会导致页面布局改变甚至破坏）
function inlineToBlock(
  node: HTMLElement,
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const rect = rectMap.get(node);
  const style = styleMap.get(node);
  if (!style || !rect || isHeading(node) || !style.display.includes(INLINE)) return;

  const ancestor = findAncestor(node, (n) => {
    return !getComputedStyle(n).display.includes(INLINE);
  });

  styleMap.set(node, { ...style, display: 'block' });
  rect.width = ancestor ? ancestor.getBoundingClientRect().width : window.innerWidth;

  if (import.meta.env.DEV) console.error('修改节点styleMap、rectMap', node);
}

function filterBasic(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  const MIN_FS = 13;
  const MID = window.innerWidth / 2;
  const maxWidth = Math.min(window.innerWidth / 3, 600);
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

    // 字号不小于 13px 的
    if (getFontSize(style) < MIN_FS) return false;

    // 剔除隐藏节点、fixed节点
    if (INVALID_DISPLAYS.includes(style.display) || FIXED_POSITIONS.includes(style.position)) return false;

    // 标题之间必须有内容
    if (!hasContent(node, nodes[i + 1], styleMap)) return false;

    // 必须独占一行
    if (!isOneLine(node, style, rect)) return false;

    inlineToBlock(node, styleMap, rectMap);

    // 需要横跨中轴，依赖 inlineToBlock
    if (MID < rect.left || MID > rect.right) return false;

    // 宽度不能过小，依赖 inlineToBlock
    if (rect.width < maxWidth) return false;

    // 剔除与相邻标题的 top 或 bottom 相等的节点
    return ![nodes[i - 1], nodes[i + 1]].some((n) => {
      const r = rectMap.get(n);
      return r?.top === rect.top || r?.bottom === rect.bottom;
    });
  });
}

// 剔除文章标题
function filterByTitle(nodes: HTMLElement[] = [], rectMap: WeakMap<HTMLElement, DOMRect>) {
  const T = 300;
  const h1Nodes: HTMLElement[] = [];

  nodes.forEach((node) => {
    const t = rectMap.get(node)?.top || 0;
    if (t < T && node.tagName === 'H1') h1Nodes.push(node);
  });

  if (h1Nodes.length === 1) {
    return nodes.filter((n) => n !== h1Nodes[0]);
  }

  return nodes;
}

function filterByScore(
  nodes: HTMLElement[],
  styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>,
  rectMap: WeakMap<HTMLElement, DOMRect>,
) {
  // TODO
  //  1、过滤
  //  2、分类：根据left、width、tagName、id、path等进行分类
  //  3、计算相似度，按相似度归类，取数量多、非法匹配少的作为结果

  const FEATS = {
    ID: 'nodeId',
    TAG: 'nodeTag',
    DEPTH: 'nodeDepth',
    PATH: 'nodePath',
    LEFT: 'nodeLeft',
    WIDTH: 'nodeWidth',
    FS: 'tagFontSize',
    NOISE: 'noise',
    NOISE_P: 'noiseParent',
    TITLE: 'docTitle',
  };

  const SCORE = {
    [`${FEATS.ID}-true`]: 3,
    [`${FEATS.NOISE}-true`]: -3,
    [`${FEATS.NOISE_P}-true`]: -3,
    [`${FEATS.TITLE}-true`]: -5,
  };

  const noiseSelector = NOISE_SELECTORS.join(SYMBOL.COMMA);

  const featIdxMap = new Map<string, number[]>();
  const addFeatIdx = (feat: string, val: string | number | boolean, idx: number) => {
    const key = `${feat}-${val.toString()}`;
    featIdxMap.has(key) ? featIdxMap.get(key)?.push(idx) : featIdxMap.set(key, [idx]);
  };

  nodes.forEach((node, i) => {
    const valId = node.id || node.getAttribute('name');
    addFeatIdx(FEATS.ID, !!valId, i);

    const valTag = node.tagName.startsWith('H') ? 'H' : 'B';
    addFeatIdx(FEATS.TAG, valTag, i);

    const [valDepth, valPath] = getDepthAndPath(node);
    addFeatIdx(FEATS.DEPTH, valDepth, i);
    addFeatIdx(FEATS.PATH, valPath, i);

    // 节点不在文章主体中，如footer、sidebar等
    addFeatIdx(FEATS.NOISE, node.matches(noiseSelector), i);
    addFeatIdx(FEATS.NOISE_P, !!node.closest(noiseSelector), i);

    const text = getText(node);
    addFeatIdx(FEATS.TITLE, !!(text && document.title.includes(text)), i);

    const rect = rectMap.get(node);
    const style = styleMap.get(node);

    addFeatIdx(FEATS.LEFT, rect?.left || -1, i);
    addFeatIdx(FEATS.WIDTH, rect?.width || -1, i);

    const fontSize = style ? getFontSize(style) : -1;
    addFeatIdx(FEATS.FS, `${node.tagName}-` + fontSize.toString(), i);
  });

  let totalScore = 0;
  const scoreMap = new WeakMap<HTMLElement, number>();

  for (const [key, idxList] of featIdxMap) {
    const ratio = SCORE[key] || 1;

    for (const i of idxList) {
      const n = nodes[i];
      const score = ratio * idxList.length;
      totalScore += score;
      scoreMap.set(n, (scoreMap.get(n) || 0) + score);
    }
  }

  const avgScore = (totalScore / nodes.length) * 0.95;

  return nodes.filter((node) => {
    return (scoreMap.get(node) || -Infinity) >= avgScore;
  });
}

function markLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>) {
  // 记录所有字号
  const sizeSet = nodes.reduce((set, node) => {
    const style = styleMap.get(node);
    const fontSize = style ? getFontSize(style) : -1;
    return set.add(fontSize);
  }, new Set<number>());

  const sizeArr = [...sizeSet]
    .filter((s) => s > 0)
    .sort((a, b) => b - a)
    .slice(0, HEADING_SELECTORS.length);

  // 标记层级
  nodes.forEach((node) => {
    const style = styleMap.get(node);
    if (!style) return;

    const l = sizeArr.indexOf(getFontSize(style)) + (isHeading(node) ? 0 : 1);
    if (l >= 0) node.setAttribute(TOC_LEVEL, l.toString());
  });
}

function markId(nodes: HTMLElement[]) {
  nodes.forEach((n, i) => (n.id = n.id || `toc-anchor-${i}`));
}
