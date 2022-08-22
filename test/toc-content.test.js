const { links } = require('./links');
const { openPage, getNodes } = require('./browser');

const TIMEOUT = 20e3;

jest.setTimeout(2 * TIMEOUT);

describe('toc content should render', () => {
  for (const link of links) {
    test('render test: ' + link[0], async () => {
      const page = await openPage(global.browser, TIMEOUT, link[1]);
      const selector = '.toc-root a';
      const nodes = await getNodes(page, selector);

      expect(nodes.length).toBe(+link[2]);
    });
  }
});
