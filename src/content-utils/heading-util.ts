import { filterOfficialHeadings } from './heading-std-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings } from './heading-all-util';
import { queryAll } from './dom-util';

export function resolveHeadings() {
  const { allHeadings, styleMap, rectMap } = getAllHeadings();
  const officialHeadings = filterOfficialHeadings(allHeadings);

  const articleNode = resolveArticle();
  const articleHeadings = allHeadings.filter((n) => articleNode.contains(n));
  const inferredHeadings = inferHeadings(articleHeadings, styleMap, rectMap);

  return { allHeadings, officialHeadings, inferredHeadings };
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

type NodeMap = WeakMap<HTMLElement, { textCount: number; rect: DOMRect }>;
