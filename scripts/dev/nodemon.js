const nodemon = require('nodemon');
const { buildDev, clearDest } = require('../build/build');
const { start: startBase, reload: reloadBase } = require('./dev-base');

let browser, pages, extInfo;

function startNodemon(startHandler, reloadHandler, reloadExtPage) {
  nodemon({
    exec: 'echo',
    ext: '*',
    delay: 2000,
    watch: ['src', 'scripts', 'public', 'test'],
    ignore: ['.git/', '**/node_modules/', 'dist/', 'public/react*.js'],
  });

  nodemon
    .on('start', async () => {
      if (browser) return;

      clearDest();
      await buildDev();

      [browser, pages, extInfo] = await startBase();
      if (startHandler) await startHandler(browser, pages, extInfo);

      console.log(`🔔 Pages and extensions loaded at ${new Date().toTimeString()}`);
    })
    .on('restart', async (files) => {
      console.log('🔔 nodemon restarted due to: ', files);

      await buildDev();

      if (reloadExtPage) await reloadBase(browser, pages);
      if (reloadHandler) await reloadHandler(browser, pages, extInfo);

      console.log(`🔔 Pages and extensions reloaded at ${new Date().toTimeString()}`);
    })
    .on('quit', () => {
      console.log('🔔 nodemon has quit');
      process.exit();
    });
}

module.exports.startNodemon = startNodemon;
