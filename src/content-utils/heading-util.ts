import { filterOfficialHeadings } from './heading-std-util';
import { resolveArticle } from './article-util';
import { inferHeadings } from './heading-infer-util';
import { genStyleInfo, getAllHeadings } from './heading-all-util';
import { getLevel, isHeading, pxToNumber } from './dom-util';
import { HEADING_SELECTORS } from '../shared/constants';
import { ResolveRule } from '../shared/resolve-rules';

export function resolveHeadings(resolveRule?: ResolveRule) {
  const articleNode = resolveArticle(resolveRule);
  const { hTagHeadings, bTagHeadings, styleHeadings, semanticHeadings, oneLineHeadings, ruleHeadings } = getAllHeadings(
    articleNode,
    resolveRule,
  );

  const { styleMap, rectMap } = genStyleInfo([
    ...hTagHeadings,
    ...bTagHeadings,
    ...styleHeadings,
    ...semanticHeadings,
    ...oneLineHeadings,
    ...ruleHeadings,
  ]);

  // 自带标题
  const officialHeadings = filterOfficialHeadings(hTagHeadings);

  // 所有标题
  let allHeadings: HTMLElement[] = mergeAllHeadings([...hTagHeadings, ...bTagHeadings, ...ruleHeadings]);

  // 精选标题：默认使用h1~h6、b、strong作为精选标题
  const tagHeadings = [...allHeadings];
  let inferredHeadings: HTMLElement[] = inferHeadings(articleNode, tagHeadings, styleMap, rectMap);

  const MIN = 1;
  // 使用加粗、大号字作为精选标题
  if (inferredHeadings.length <= MIN) {
    const tempHeadings = dropChildren(styleHeadings);
    allHeadings = mergeAllHeadings([...allHeadings, ...tempHeadings]);
    inferredHeadings = inferHeadings(articleNode, tempHeadings, styleMap, rectMap);
  }

  // 使用带序号文字作为精选标题
  if (inferredHeadings.length <= MIN) {
    const tempHeadings = dropChildren(semanticHeadings);
    allHeadings = mergeAllHeadings([...allHeadings, ...tempHeadings]);
    inferredHeadings = inferHeadings(articleNode, tempHeadings, styleMap, rectMap);
  }

  // 使用单行文本作为精选标题
  if (inferredHeadings.length <= MIN) {
    const tempHeadings = dropSiblings(dropChildren(oneLineHeadings));
    allHeadings = mergeAllHeadings([...allHeadings, ...tempHeadings]);
    inferredHeadings = inferHeadings(articleNode, tempHeadings, styleMap, rectMap);
  }

  return {
    allHeadings: attachLevel(allHeadings, styleMap),
    officialHeadings: attachLevel(officialHeadings, styleMap),
    inferredHeadings: attachLevel(inferredHeadings, styleMap),
  };
}

function mergeAllHeadings(nodes: HTMLElement[]) {
  nodes = nodes.sort((a, b) => {
    if (a === b) return 0;
    // Node.DOCUMENT_POSITION_FOLLOWING, Node.DOCUMENT_POSITION_CONTAINED_BY
    return [4, 16].includes(a.compareDocumentPosition(b)) ? -1 : 1;
  });

  return dropChildren(nodes);
}

// 过滤子孙节点
function dropChildren(nodes: HTMLElement[]) {
  const stack: HTMLElement[] = [];
  nodes.forEach((node) => {
    if (!stack.at(-1)?.contains(node)) stack.push(node);
  });
  return stack;
}

// 过滤兄弟节点
function dropSiblings(nodes: HTMLElement[]) {
  const stack: HTMLElement[] = [];
  nodes.forEach((node) => {
    if (stack.at(-1)?.nextElementSibling !== node) stack.push(node);
  });
  return stack;
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
