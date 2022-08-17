const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromePath = require('chrome-location');
const { DEST_ABS: extensionPath } = require('../scripts/config');

async function openBrowser() {
  return await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    handleSIGTERM: true,
    handleSIGINT: true,
    args: [
      '--window-size=1920,1080',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
}

module.exports.openBrowser = openBrowser;

// TODO：可删除，仅用于cypress测试前准备
function modifyManifest() {
  const mfPath = path.resolve(extensionPath, 'manifest.json');
  const utf8 = 'utf8';

  const content = fs.readFileSync(mfPath, utf8);
  const json = JSON.parse(content);
  const contentScripts = json.content_scripts;
  for (const s of contentScripts) {
    s.all_frames = true;
    if (!s.exclude_matches?.length) s.exclude_matches = [];
    const ex = '*://*/__/*';
    if (!s.exclude_matches.includes(ex)) s.exclude_matches.push(ex);
  }
  fs.writeFileSync(mfPath, JSON.stringify(json, null, 4), utf8);
}
