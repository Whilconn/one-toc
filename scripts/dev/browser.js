const puppeteer = require('puppeteer-core');
const chromePath = require('chrome-location');
const { DEST_ABS: extensionPath } = require('../vite.config');

const SW = 1920;
const SH = 1080;
const TIMEOUT = 20e3;
const WAIT_UNTIL = 'domcontentloaded';

async function openBrowser() {
  return await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    handleSIGTERM: true,
    handleSIGINT: true,
    handleSIGHUP: true,
    waitForInitialPage: false,
    defaultViewport: null,
    args: [
      '--no-startup-window',
      '--start-maximized',
      `--window-size=${SW},${SH}`,
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
}

async function openPage(browser, url, timeout = TIMEOUT) {
  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  await page.goto(url, { waitUntil: WAIT_UNTIL });
  return page;
}

function reloadPage(page) {
  return page.reload({ waitUntil: WAIT_UNTIL });
}

async function getNodes(page, selector) {
  await page.waitForSelector(selector);
  return await page.$$(selector);
}

module.exports = { openBrowser, openPage, reloadPage, getNodes };
