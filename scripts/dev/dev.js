const { startNodemon } = require('./nodemon');
const { openPage, reloadPage } = require('./browser');
const { COMMANDS } = require('../constant');
const { links } = require('../../test/links');
const manifest = require('../../public/manifest.json');

function dev(command) {
  let start = async (browser, pages) => {
    pages.contentPage = await openPage(browser, links[0][1]);
  };

  let reload = (browser, pages) => reloadPage(pages.contentPage);
  let reloadExtPage = true;

  // default command is COMMANDS.DEV_CONTENT
  if (command === COMMANDS.DEV_OPTIONS) {
    start = async (browser, pages, extInfo) => {
      pages.optionsPage = await openPage(browser, extInfo.optionsPage.url);
    };

    reload = (browser, pages) => reloadPage(pages.optionsPage);
    reloadExtPage = false;
  } else if (command === COMMANDS.DEV_POPUP) {
    start = async (browser, pages, extInfo) => {
      const url = `chrome-extension://${extInfo.id}/${manifest.action.default_popup}`;
      pages.popupPage = await openPage(browser, url);
    };

    reload = (browser, pages) => reloadPage(pages.popupPage);
    reloadExtPage = false;
  }

  startNodemon(start, reload, reloadExtPage);
}

module.exports = { dev };
