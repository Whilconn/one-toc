const { links } = require('./links');
const { openBrowser } = require('./launch-browser');

const TIMEOUT = 20e3;

jest.setTimeout(2 * TIMEOUT);

describe('toc content test', () => {
  beforeAll(async () => {
    global.browser = await openBrowser();
  });

  afterAll(async () => {
    await global.browser.close();
  });

  for (const link of links) {
    test(link[0], async () => {
      const page = await global.browser.newPage();
      page.setDefaultTimeout(TIMEOUT);
      await page.setViewport({ width: 1400, height: 700, deviceScaleFactor: 1 });
      await page.goto(link[1]);

      const selector = '.toc-root a';
      await page.waitForSelector(selector);
      const nodes = await page.$$(selector);

      expect(nodes.length).toBe(+link[2]);
    });
  }
});
