import { getText, queryAll } from './dom-util';
import { HEADING_SELECTORS, SYMBOL } from '../shared/constants';

// 根据标准与网页自带锚点获取heading
export function getOfficialHeadings() {
  let headings = getStandardHeadings();
  const anchors = getAnchors();
  const selectors = anchors.map((node) => {
    const href = node.getAttribute('href') || '';
    const id = hrefToId(href);
    const s = `#${id},[name='${id}']`;
    return `:is(${s},:has(${s}))`;
  });

  headings = headings.filter((node) => {
    return selectors.find((s) => node.matches(s));
  });

  return headings;
}

// 根据标准获取heading
export function getStandardHeadings() {
  const headingSelector = HEADING_SELECTORS.join(SYMBOL.COMMA);
  // 选择自身或子孙节点带有 id,name 属性的所有heading
  const selector = `:is(${headingSelector}):is([id],[name],:has([id],[name]))`;
  return queryAll(selector).filter((n) => {
    return getText(n);
  });
}

function getAnchors() {
  const nodes = queryAll('a[href^="#"]');

  const set = new Set();

  return nodes.filter((n) => {
    const href = n.getAttribute('href') || '';
    const duplicated = set.has(href);
    set.add(href);

    return !duplicated;
  });
}

function hrefToId(href: string) {
  return href.replace(/^#/, '').replace(/([^0-9a-z])/gi, '\\$1');
}
