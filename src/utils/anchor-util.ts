import { FIXED_POSITIONS, HEADING_SELECTORS, SYMBOL } from '../content/constants';
import { getText } from './dom-util';

const INVALID_DISPLAYS = ['inline', 'none'];
const INVALID_SELECTORS = [
  'header',
  'aside',
  '.aside',
  '.side',
  '.left',
  '.right',
  'footer',
  '.foot',
  '.footer',
  '.comment',
];

export function getAnchors() {
  const selector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];
  nodes = filterAnchors(nodes);
  const groups = groupAnchors(nodes);
  nodes = getAnchorsByWeight(groups);
  nodes = shiftTitleFromAnchors(nodes);
  markAnchors(nodes);

  return nodes;
}

function filterAnchors(nodes: HTMLElement[]) {
  return nodes.filter((node) => {
    if (!getText(node)) return false;

    const selector = INVALID_SELECTORS.map((s) => `${s} ${node.tagName}`).join(SYMBOL.COMMA);
    if (node.matches(selector)) return false;

    const MIN = 8;
    if (node.scrollWidth < MIN && node.scrollHeight < MIN) return false;

    const style = getComputedStyle(node);
    return !INVALID_DISPLAYS.includes(style.display) && !FIXED_POSITIONS.includes(style.position);
  });
}

function markAnchors(nodes: HTMLElement[]) {
  nodes.map((n, i) => (n.id = n.id || `toc-anchor-${i}`));
}

function genSelector(node: HTMLElement) {
  if (!node) return '';

  const selectors = [];

  while ((node = node.parentNode as HTMLElement)) {
    selectors.push([node.tagName, ...(node.classList || [])].map((c) => '.' + c).join(''));
  }

  return selectors.reverse().join('>');
}

// TODO：添加分组策略，按左右边界是否对齐过滤

function groupAnchors(nodes: HTMLElement[]) {
  const groups: HTMLElement[][] = [];

  let group: HTMLElement[], parent: HTMLElement, ancestorsSelector: string;

  // group by parent selector
  nodes.forEach((node) => {
    if (parent?.contains(node)) {
      return group.push(node);
    }

    const pSelector = genSelector(node);
    if (ancestorsSelector && pSelector.startsWith(ancestorsSelector)) {
      return group.push(node);
    }

    group = [];
    parent = node.parentNode as HTMLElement;
    ancestorsSelector = pSelector;
    groups.push(group);
    group.push(node);
  });

  return groups;
}

function getAnchorsByWeight(groups: HTMLElement[][]) {
  if (!groups.length) return [];

  const groupWeights = groups.map(() => 0);

  function accWeights(weights: number[], scores: number[][], results: number[]) {
    const sortedGroupIdxList = scores.sort((a, b) => b[1] - a[1]).map((s) => s[0]);
    sortedGroupIdxList.forEach((gi, wi) => {
      results[gi] += weights[wi] || 0;
    });
  }

  const COUNT_WEIGHTS = [18, 16, 14, 12, 10, 8, 6, 4, 2];
  const countScores = groups.map((g, i) => [i, g.length]);
  accWeights(COUNT_WEIGHTS, countScores, groupWeights);

  const HEIGHT_WEIGHTS = [18, 16, 14, 12, 10, 8, 6, 4, 2];
  const heightScores = groups.map((g, i) => {
    const gc1 = g[0].getBoundingClientRect();
    const gc2 = g[g.length - 1].getBoundingClientRect();
    return [i, gc2.bottom - gc1.top];
  });
  accWeights(HEIGHT_WEIGHTS, heightScores, groupWeights);

  const ARTICLE_SELECTORS = ['article,.article', '.blog,.post'];
  const SELECTOR_WEIGHTS = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
  groups.forEach((g, i) => {
    const si = ARTICLE_SELECTORS.findIndex((s) => {
      return g[0].matches(`${s} ${g[0].tagName}`);
    });
    groupWeights[i] += SELECTOR_WEIGHTS[si] || 0;
  });

  const ws = groupWeights.map((w, i) => [i, w]).sort((a, b) => b[1] - a[1]);

  return groups[ws[0][0]];
}

function shiftTitleFromAnchors(nodes: HTMLElement[]) {
  const H1 = 'H1';
  if (!nodes.length || nodes[0].tagName !== H1) return nodes;

  const t2 = nodes.find((n, i) => i && n.tagName === H1);
  if (!t2 || genSelector(t2) !== genSelector(nodes[0])) {
    nodes.shift();
  }
  return nodes;
}