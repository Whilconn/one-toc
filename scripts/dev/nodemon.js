const nodemon = require('nodemon');
const { buildDev } = require('../build');
const { openBrowser, openPage } = require('./browser');
const pkg = require('../../package.json');

const EXT_URL = 'chrome://extensions';
const EXT_TAG = 'extensions-manager';

async function startExtension() {
  const browser = await openBrowser();
  const extPage = await openPage(browser, EXT_URL);
  const extInfo = await extPage.$eval(
    EXT_TAG,
    (node, name) => {
      if (node) return node.extensions_.filter((e) => e.name === name)[0];
    },
    pkg.extName,
  );

  return [browser, { extPage }, extInfo];
}

async function reloadExtension(browser, pages) {
  await pages.extPage.$eval(EXT_TAG, (node) => {
    if (node) return node.delegate.updateAllExtensions(node.extensions_);
  });
}

let browser, pages, extInfo;

function startNodemon(startHandler, reloadHandler, reloadExtPage) {
  nodemon({
    exec: 'echo',
    ext: '*',
    delay: 2000,
    watch: ['src', 'scripts', 'public', 'test'],
    ignore: ['.git/', '**/node_modules/', 'dist/'],
  });

  nodemon
    .on('start', async () => {
      if (browser) return;

      await buildDev(true);

      [browser, pages, extInfo] = await startExtension();
      if (startHandler) await startHandler(browser, pages, extInfo);

      console.log(`🔔 Pages and extensions loaded at ${new Date().toTimeString()}`);
    })
    .on('restart', async (files) => {
      console.log('🔔 nodemon restarted due to: ', files);

      await buildDev();

      if (reloadExtPage) await reloadExtension(browser, pages);
      if (reloadHandler) await reloadHandler(browser, pages, extInfo);

      console.log(`🔔 Pages and extensions reloaded at ${new Date().toTimeString()}`);
    })
    .on('quit', () => {
      console.log('🔔 nodemon has quit');
      process.exit();
    });
}

module.exports = { startNodemon };
