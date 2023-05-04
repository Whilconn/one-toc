import { queryAll } from './dom-util';
import { HEADING_SELECTORS, SYMBOL } from '../shared/constants';

// 根据标准与网页自带锚点获取heading
export function filterOfficialHeadings(headings: HTMLElement[]) {
  const selectorCountMap = inferHeadingSelectorMap();
  const selectors = [...selectorCountMap.keys()];
  headings = filterStandardHeadings(headings);

  // 过滤出既满足标准，又存在页内超链接的 heading
  let c1 = 0;
  const counts: number[] = [];
  headings = headings.filter((node) => {
    const selector = selectors.find((s) => node.matches(s));
    if (!selector) return false;

    const count = selectorCountMap.get(selector) || 0;
    counts.push(count);
    if (count === 1) c1 += 1;

    return true;
  });

  const rate = c1 / counts.length;
  if (rate < 0.2 && c1 < 10) {
    headings = headings.filter((_, i) => counts[i] > 1);
  }

  return headings.length > 1 ? headings : [];
}

// 根据标准获取heading
function filterStandardHeadings(headings: HTMLElement[]) {
  const headingSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  // 标准：提取自身或子孙节点带有 id,name 属性的所有heading
  const exactSelector = `:is(${headingSelector}):is([id],[name],:has([id],[name]))`;

  return headings.filter((n) => n.matches(exactSelector));
}

// 根据所有 页内超链接 推断出所有可能的 heading 选择器
function inferHeadingSelectorMap() {
  const anchors = queryAll('a[href*="#"]') as HTMLAnchorElement[];
  const selectorMap = new Map<string, number>();

  for (const node of anchors) {
    const href = (node.getAttribute('href') || '').trim();
    const id = hrefToId(href);
    const s = `#${id},[name='${id}']`;
    const selector = `:is(${s},:has(${s}))`;

    selectorMap.set(selector, (selectorMap.get(selector) || 0) + 1);
  }

  return selectorMap;
}

function hrefToId(href: string) {
  return href.replace(/^[^#]*#/, '').replace(/([^0-9a-z])/gi, '\\$1');
}
