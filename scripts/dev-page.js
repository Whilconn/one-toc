const { links } = require('../test/links');
const { openBrowser, openPage } = require('../test/browser');

async function openDevPage() {
  const browser = await openBrowser();
  const extPage = await openPage(browser, 'chrome://extensions');
  const appPage = await openPage(browser, links[0][1]);

  console.log(`🔔 Pages and extensions loaded at ${new Date().toTimeString()}`);

  return [browser, appPage, extPage];
}

async function reloadDevPage(appPage, extPage) {
  await extPage.$eval('extensions-manager', (node) => {
    if (node) return node.delegate.updateAllExtensions(node.extensions_);
  });

  await appPage.reload();

  console.log(`🔔 Pages and extensions reloaded at ${new Date().toTimeString()}`);
}

module.exports = { openDevPage, reloadDevPage };
