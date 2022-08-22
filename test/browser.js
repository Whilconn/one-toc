const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromePath = require('chrome-location');
const { DEST_ABS: extensionPath } = require('../scripts/config');

const TIMEOUT = 20e3;
const SW = 1920;
const SH = 1080;

async function openBrowser() {
  return await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    handleSIGTERM: true,
    handleSIGINT: true,
    handleSIGHUP: true,
    waitForInitialPage: false,
    args: [
      '--no-startup-window',
      '--start-maximized',
      `--window-size=${SW},${SH}`,
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
}

async function openPage(browser, timeout = TIMEOUT, url) {
  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.setViewport({ width: SW, height: SH, deviceScaleFactor: 1 });
  await page.goto(url);

  return page;
}

async function getNodes(page, selector) {
  await page.waitForSelector(selector);
  return await page.$$(selector);
}

module.exports = { openBrowser, openPage, getNodes };

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
