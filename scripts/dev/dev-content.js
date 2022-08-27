const { startNodemon } = require('./nodemon');
const { openPage } = require('../browser');
const { links } = require('../../test/links');

async function start(browser, pages) {
  pages.contentPage = await openPage(browser, links[0][1]);
}

function reload(browser, pages) {
  return pages.contentPage.reload();
}

startNodemon(start, reload, true);
