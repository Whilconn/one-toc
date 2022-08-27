const { openBrowser } = require('../scripts/browser');

module.exports = async function () {
  global.browser = await openBrowser();

  ['exit', 'SIGINT'].forEach((e) => {
    process.on(e, async () => {
      if (!global.browser.isConnected()) return;

      console.log(`🔔 Jest received ${e} signal, browser will be closed!`);
      await global.browser.close();
    });
  });
};
