const nodemon = require('nodemon');
const { build } = require('./build');
const { openDevPage, reloadDevPage } = require('./dev-page');

nodemon({
  exec: 'echo',
  ext: '*',
  delay: 2000,
  watch: ['src', 'scripts', 'public', 'test'],
  ignore: ['.git/', '**/node_modules/', 'dist/', 'public/react*.js'],
});

let browser, pages;

nodemon
  .on('start', async () => {
    await build();

    if (browser) return await reloadDevPage(pages);
    [browser, pages] = await openDevPage(browser);
  })
  .on('quit', () => {
    console.log('🔔 nodemon has quit');
    process.exit();
  })
  .on('restart', (files) => {
    console.log('🔔 nodemon restarted due to: ', files);
  });
