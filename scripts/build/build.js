const fs = require('fs');
const path = require('path');
const vite = require('vite');
const _ = require('lodash');
const { ROOT_ABS, DEST_ABS, PUBLIC_ABS } = require('../config');
const viteConfigDev = require('../vite.config.dev');
const viteConfigProd = require('../vite.config.prod');
const manifest = require('../../public/manifest.json');

const MODE = { DEV: 'development', PROD: 'production' };

const CONFIG = {
  development: {
    viteConfig: viteConfigDev,
    sourceFiles: [
      'node_modules/react/umd/react.development.js',
      'node_modules/react-dom/umd/react-dom.development.js',
      'node_modules/antd/dist/antd.min.js',
      'node_modules/antd/dist/antd.min.css',
    ],
  },
  production: {
    viteConfig: viteConfigProd,
    sourceFiles: [
      'node_modules/react/umd/react.production.min.js',
      'node_modules/react-dom/umd/react-dom.production.min.js',
      'node_modules/antd/dist/antd.min.js',
      'node_modules/antd/dist/antd.min.css',
    ],
  },
};

function clearDest() {
  if (fs.existsSync(DEST_ABS)) fs.rmSync(DEST_ABS, { recursive: true });
}

function copyReactLibs(mode) {
  const buildConfig = CONFIG[mode];

  buildConfig.sourceFiles.forEach((src) => {
    let target = src.replace(/.+\//, '').replace(/\..+\./, '.');
    src = path.resolve(ROOT_ABS, src);
    target = path.resolve(PUBLIC_ABS, target);
    fs.copyFileSync(src, target);
  });
}

function build(mode) {
  const buildConfig = CONFIG[mode];

  const entries = {
    content: 'src/content-view/content.tsx',
    options: 'src/options-view/options.tsx',
    background: 'src/background/background.ts',
  };

  const buildTasks = [];
  for (const [key, entry] of Object.entries(entries)) {
    const cfg = _.cloneDeep(buildConfig.viteConfig);
    cfg.build.lib = {
      ...cfg.build.lib,
      entry,
      name: manifest.name + key[0].toUpperCase() + key.slice(1),
      fileName: () => key + '.js',
    };
    buildTasks.push(vite.build(cfg));
  }

  return Promise.all(buildTasks);
}

module.exports.clearDest = clearDest;

module.exports.buildProd = () => {
  clearDest();
  copyReactLibs(MODE.PROD);
  return build(MODE.PROD);
};

module.exports.buildDev = () => {
  copyReactLibs(MODE.DEV);
  return build(MODE.DEV);
};
