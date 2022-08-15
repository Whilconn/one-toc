const urls = [
  ['知乎', 'https://zhuanlan.zhihu.com/p/24650288'],
  ['开源中国', 'https://my.oschina.net/u/4843764/blog/5528481'],
  ['博客园', 'https://www.cnblogs.com/teach/p/16295605.html'],
  ['CSDN', 'https://blog.csdn.net/csdnnews/article/details/124880259'],
  ['51cto', 'https://blog.51cto.com/harmonyos/5318953'],
  ['掘金', 'https://juejin.cn/post/7130934881554530334'],
  ['思否', 'https://segmentfault.com/a/1190000041806654'],
  ['React Doc(CN)', 'https://react.docschina.org/docs/getting-started.html'],
  ['Eslint(CN)', 'http://eslint.cn/docs/user-guide/getting-started'],
  // ['简书', 'https://www.jianshu.com/p/a2cb1e3a79be'],
  // ['React Doc(EN)', 'https://reactjs.org/docs/getting-started.html'],
  // ['Eslint(EN)', 'https://eslint.org/docs/user-guide/getting-started'],
  // ['Github(EN)', 'https://github.com/facebook/react'],
  // ['NCBI(EN)', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6742634/'],
];

describe('toc content render', () => {
  for (const url of urls) {
    it(url[0], () => {
      cy.visit(url[1], { timeout: 20e3, log: false });
      cy.get('.toc-root a').should((a) => {
        expect(a).to.have.length.gt(3);
      });
    });
  }
});

export {};
