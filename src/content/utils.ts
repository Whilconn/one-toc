import { HEADING_SELECTORS, HEADER_HEIGHT, SYMBOL } from './constants';

export function getHeaderHeight() {
  const tag = 'header';
  const reg = new RegExp(tag, 'i');
  const nodes = document.elementsFromPoint(0, 30);

  const header = nodes.find((node) => {
    return node.tagName.toLowerCase() === tag || reg.test(node.className || '');
  });

  return 20 + Math.min(header ? header.scrollHeight : HEADER_HEIGHT, 2 * HEADER_HEIGHT);
}

function filterAnchors(nodes: HTMLElement[]) {
  const invalidSelector = ['header', 'aside,.aside,.side', '.left,.right', 'footer,.foot,.footer', '.comment'];
  const invalidDisplays = ['inline', 'none'];
  const invalidPositions = ['sticky', 'fixed', 'absolute'];

  return nodes.filter((node) => {
    if (node.matches(`${invalidSelector} ${node.tagName}`)) return false;

    const MIN = 8;
    if (node.scrollWidth < MIN && node.scrollHeight < MIN) return false;

    const style = getComputedStyle(node);
    return !invalidDisplays.includes(style.display) && !invalidPositions.includes(style.position);
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

  const groupWeights = groups.map((g) => 0);

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

function removeTitleFromAnchors(nodes: HTMLElement[]) {
  const H1 = 'H1';
  if (nodes.length && nodes[0].tagName === H1 && !nodes.some((n, i) => i && n.tagName === H1)) {
    nodes.shift();
  }
  return nodes;
}

export function getAnchors() {
  const selector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  let nodes: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[];
  nodes = filterAnchors(nodes);
  const groups = groupAnchors(nodes);
  nodes = getAnchorsByWeight(groups);
  nodes = removeTitleFromAnchors(nodes);
  markAnchors(nodes);

  return nodes;
}

export function getAnchorTopList(anchorNodes: HTMLElement[], marginTop: number) {
  const scrollY = window.scrollY;

  return anchorNodes.map((n, i) => {
    if (i >= anchorNodes.length - 1) return Infinity;
    return scrollY + anchorNodes[i + 1].getBoundingClientRect().top - marginTop;
  });
}
