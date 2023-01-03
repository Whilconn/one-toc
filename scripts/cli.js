const path = require('path');
const { dev } = require('./dev/dev');
const { buildProd, buildDev } = require('./build');
const { zip } = require('./zip');
const { COMMANDS } = require('./constant');

async function start() {
  const [command, ...options] = process.argv.slice(2);

  const fileName = path.relative('.', __filename);
  console.log(`[${fileName}]：${JSON.stringify({ command, options })}`);

  if (command === COMMANDS.BUILD) {
    await buildProd();
  } else if (command === COMMANDS.BUILD_DEV) {
    await buildDev(true);
  } else if (command.startsWith(COMMANDS.DEV)) {
    dev(command);
  } else if (command === COMMANDS.ZIP) {
    await buildProd();
    zip();
  }
}

start().then();
