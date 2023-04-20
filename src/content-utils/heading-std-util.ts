import { queryAll } from './dom-util';
import { HEADING_SELECTORS, SYMBOL } from '../shared/constants';

// 根据标准与网页自带锚点获取heading
export function filterOfficialHeadings(headings: HTMLElement[]) {
  const selectors = inferHeadingSelectors();
  headings = filterStandardHeadings(headings);

  // 过滤出既满足标准，又存在页内超链接的 heading
  headings = headings.filter((node) => {
    return selectors.find((s) => node.matches(s));
  });

  return headings;
}

// 根据标准获取heading
function filterStandardHeadings(headings: HTMLElement[]) {
  const headingSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  // 标准：提取自身或子孙节点带有 id,name 属性的所有heading
  const exactSelector = `:is(${headingSelector}):is([id],[name],:has([id],[name]))`;

  return headings.filter((n) => n.matches(exactSelector));
}

// 根据所有 页内超链接 推断出所有可能的 heading 选择器
function inferHeadingSelectors() {
  const set = new Set();
  const selectors = [];
  const anchors = queryAll('a[href^="#"]');

  for (const node of anchors) {
    const href = (node.getAttribute('href') || '').trim();

    // 跳过 href === '#'，跳过重复
    if (href.length === 1 || set.has(href)) continue;

    set.add(href);

    const id = hrefToId(href);
    const s = `#${id},[name='${id}']`;
    selectors.push(`:is(${s},:has(${s}))`);
  }

  return selectors;
}

function hrefToId(href: string) {
  return href.replace(/^#/, '').replace(/([^0-9a-z])/gi, '\\$1');
}
