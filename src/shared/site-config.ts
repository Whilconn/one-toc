export const SITES: Site[] = [
  { url: 'https://www.huxiu.com/article/', article: '#article-content', headings: '' },
  { url: 'https://my.oschina.net/u/', article: '.article-detail .content', headings: '' },
  { url: 'https://mp.weixin.qq.com/s/', article: '#js_content', headings: '' },
  { url: 'https://www.iteye.com/blog/', article: '.iteye-blog-content-contain', headings: '' },
  { url: 'https://www.iteye.com/news/', article: '#news_content', headings: '' },
  { url: 'https://zhuanlan.zhihu.com/p/', article: '.Post-RichText', headings: '' },
];

type Site = { url: string; article: string; headings: string };
