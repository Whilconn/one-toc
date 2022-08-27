const manifest = require('../public/manifest.json');
const { links } = require('../test/links');
const { openBrowser, openPage } = require('../test/browser');

const EXT_URL = 'chrome://extensions';
const EXT_TAG = 'extensions-manager';

async function openDevPage() {
  const browser = await openBrowser();
  const extPage = await openPage(browser, EXT_URL);
  const extInfo = await extPage.$eval(
    EXT_TAG,
    (node, name) => {
      if (node) return node.extensions_.filter((e) => e.name === name)[0];
    },
    manifest.name,
  );
  const extId = extInfo.id;

  const contentPage = await openPage(browser, links[0][1]);
  const popupPage = await openPage(browser, genPopupUrl(extId, manifest.action.default_popup));

  console.log(`🔔 Pages and extensions loaded at ${new Date().toTimeString()}`);

  const pages = { extPage, contentPage, popupPage };
  return [browser, pages];
}

async function reloadDevPage({ extPage, contentPage, popupPage }) {
  await extPage.$eval(EXT_TAG, (node) => {
    if (node) return node.delegate.updateAllExtensions(node.extensions_);
  });

  await Promise.all([contentPage.reload(), popupPage.reload()]);

  console.log(`🔔 Pages and extensions reloaded at ${new Date().toTimeString()}`);
}

function genPopupUrl(extId, pageName) {
  return `chrome-extension://${extId}/${pageName}`;
}

module.exports = { openDevPage, reloadDevPage };
