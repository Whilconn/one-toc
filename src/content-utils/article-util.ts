import { getRect, isHidden, queryAll } from './dom-util';
import { SITES } from '../shared/site-config';

export function resolveArticle(): HTMLElement {
  // 根据配置获取文章节点
  let mainNode: HTMLElement = document.body;
  const siteConfig = SITES.find((s) => location.href.startsWith(s.url));
  let articleNode = siteConfig?.article ? queryAll(siteConfig?.article)[0] : null;

  // 根据算法获取文章节点
  if (!articleNode) {
    const nodes = queryAll('body :not(:is(script,style,svg))');

    let maxLen = 0;
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

    articleNode = validNodes.findLast((node) => validateArticleNode(node, mainNode, map)) || mainNode;
  }

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

function getValidText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s/g, '');
}

type NodeMap = WeakMap<HTMLElement, { textCount: number; rect: DOMRect }>;
