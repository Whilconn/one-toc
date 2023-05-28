const { links } = require('./links');
const { openPage, getNodes } = require('../scripts/dev/browser');

const TIMEOUT = 20e3;

jest.setTimeout(2 * TIMEOUT);

describe('counts toc heading', () => {
  test.concurrent.each(links)('%s %s %i', async (name, link, num) => {
    const page = await openPage(global.browser, link, TIMEOUT);
    const selector = '.onetoc-body a';
    const nodes = await getNodes(page, selector);

    expect(nodes.length).toBe(+num);

    if (nodes.length === +num) page.close();
  });
});
