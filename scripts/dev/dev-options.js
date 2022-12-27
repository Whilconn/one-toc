const { openPage } = require('../browser');
const { startNodemon } = require('./nodemon');

async function start(browser, pages, extInfo) {
  pages.optionsPage = await openPage(browser, extInfo.optionsPage.url);
}

function reload(browser, pages) {
  return pages.optionsPage.reload();
}

startNodemon(start, reload, false);
