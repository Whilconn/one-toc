const { openBrowser, openPage } = require('../browser');
const manifest = require('../../public/manifest.json');

const EXT_URL = 'chrome://extensions';
const EXT_TAG = 'extensions-manager';

async function start() {
  const browser = await openBrowser();
  const extPage = await openPage(browser, EXT_URL);
  const extInfo = await extPage.$eval(
    EXT_TAG,
    (node, name) => {
      if (node) return node.extensions_.filter((e) => e.name === name)[0];
    },
    manifest.name,
  );

  return [browser, { extPage }, extInfo];
}

async function reload(browser, pages) {
  await pages.extPage.$eval(EXT_TAG, (node) => {
    if (node) return node.delegate.updateAllExtensions(node.extensions_);
  });
}

module.exports = { start, reload };
