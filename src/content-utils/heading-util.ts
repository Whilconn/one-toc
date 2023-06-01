import { filterOfficialHeadings } from './heading-std-util';
import { resolveArticle } from './article-util';
import { inferHeadings } from './heading-infer-util';
import { getAllHeadings } from './heading-all-util';
import { getLevel, isHeading, pxToNumber } from './dom-util';
import { HEADING_SELECTORS } from '../shared/constants';

export function resolveHeadings() {
  const articleNode = resolveArticle();
  const { hTagHeadings, bTagHeadings, styleHeadings, semanticHeadings, styleMap, rectMap } =
    getAllHeadings(articleNode);

  const officialHeadings = filterOfficialHeadings(hTagHeadings);
  let allHeadings: HTMLElement[] = [...hTagHeadings, ...bTagHeadings];
  let inferredHeadings: HTMLElement[] = [];

  if (officialHeadings.length < 5) {
    // 默认使用h1~h6、b、strong作为精选标题
    const tagHeadings = mergeHeadings([...hTagHeadings, ...bTagHeadings]);
    inferredHeadings = inferHeadings(articleNode, tagHeadings, styleMap, rectMap);

    const MIN = 1;
    // 使用加粗、大字号作为精选标题
    if (inferredHeadings.length <= MIN) {
      inferredHeadings = inferHeadings(articleNode, styleHeadings, styleMap, rectMap);
      allHeadings = [...allHeadings, ...styleHeadings];
    }

    // 使用带序号文字作为精选标题
    if (inferredHeadings.length <= MIN) {
      inferredHeadings = inferHeadings(articleNode, semanticHeadings, styleMap, rectMap);
      allHeadings = [...allHeadings, ...styleHeadings, ...semanticHeadings];
    }
  }

  return {
    allHeadings: attachLevel(mergeHeadings(allHeadings), styleMap),
    officialHeadings: attachLevel(officialHeadings, styleMap),
    inferredHeadings: attachLevel(inferredHeadings, styleMap),
  };
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

function attachLevel(nodes: HTMLElement[], styleMap: WeakMap<HTMLElement, CSSStyleDeclaration>): Heading[] {
  let minLevel = Infinity;
  let maxFontSize = -Infinity;
  const nodeLevels: NodeLevel[] = nodes.map((node): NodeLevel => {
    const style = styleMap.get(node);
    const fontsize = style ? pxToNumber(style.fontSize) : -1;
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

type NodeLevel = { node: HTMLElement; fontsize: number; isHeading: boolean; level: number };

export type Heading = Pick<NodeLevel, 'node' | 'level'>;
