const manifest = require('../../public/manifest.json');
const { openPage } = require('../browser');
const { startNodemon } = require('./nodemon');

async function start(browser, pages, extInfo) {
  const url = `chrome-extension://${extInfo.id}/${manifest.action.default_popup}`;
  pages.popupPage = await openPage(browser, url);
}

function reload(browser, pages) {
  return pages.popupPage.reload();
}

startNodemon(start, reload, false);
