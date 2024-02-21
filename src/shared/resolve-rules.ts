import * as micromatch from 'micromatch';

export const RESOLVE_RULES: ResolveRule[] = [
  {
    pages: ['https://www.huxiu.com/article/**'],
    article: '#article-content',
    headings: ['#article-content [label*=标题][class*=title]'],
  },
  {
    pages: ['https://my.oschina.net/u/**'],
    article: '.article-detail .content',
    headings: [],
  },
  {
    pages: ['https://mp.weixin.qq.com/s/**'],
    article: '#js_content',
    headings: [],
  },
  {
    pages: ['https://www.iteye.com/blog/**'],
    article: '.iteye-blog-content-contain',
    headings: [],
  },
  {
    pages: ['https://www.iteye.com/news/**'],
    article: '#news_content',
    headings: [],
  },
  {
    pages: ['https://zhuanlan.zhihu.com/p/**'],
    article: '.Post-RichText',
    headings: [],
  },
];

export function matchResolveRule(rules: ResolveRule[]) {
  const pathInUrl = location.host + location.pathname;
  if (!rules?.length) rules = RESOLVE_RULES;

  return rules.find((c) => micromatch.some([location.href, pathInUrl], c.pages));
}

export type ResolveRule = {
  // 网页匹配规则
  pages: string[];
  // 正文DOM选择器
  article: string;
  // 段落标题DOM选择器
  headings: string[];
};
