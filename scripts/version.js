const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PUBLIC = 'public';
const UTF8 = 'utf-8';
const root = path.resolve(__dirname, '..');
const options = process.argv.slice(2).join(' ') || 'patch';
const cmd = `npm version ${options} --no-commit-hooks --no-git-tag-version`;

cp.exec(cmd, { encoding: UTF8 }, (error, stdout, stderr) => {
  console.log('\n%s%s\n', '执行命令：', cmd);

  if (error) return console.error(error.stack);

  const pkg = require(path.resolve(root, 'package.json'));
  const version = pkg.version;

  const manifestPath = path.resolve(root, PUBLIC, 'manifest.json');
  const manifest = require(manifestPath);
  manifest.version = version;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), UTF8);

  if (stdout) console.log(stdout);
  if (stderr) console.error('=================== stderr ===================', '\n', stderr);
});
