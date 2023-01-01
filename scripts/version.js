const cp = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * @description 版本变更时运行，同时修改package.json与manifest.json中的版本号
 * @example node scripts/version.js [options]
 * 参考：npm version --help
 * options：<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git
 * 常用options：major | minor | patch | 空
 */

const UTF8 = 'utf-8';
const options = process.argv.slice(2).join(' ') || 'patch';
const cmd = `npm version ${options} --no-commit-hooks --no-git-tag-version`;

cp.exec(cmd, { encoding: UTF8 }, (error, stdout, stderr) => {
  console.log('\n%s%s\n', '执行命令：', cmd);

  if (error) return console.error(error.stack);

  if (stdout) console.log(stdout);
  if (stderr) console.error('=================== stderr ===================', '\n', stderr);
});
