const fs = require('fs');
const path = require('path');
const vite = require('vite');
const { configFn, ROOT_ABS, DEST_ABS, PUBLIC_ABS } = require('../vite.config');

const MODE = { DEV: 'development', PROD: 'production' };

function clearDest() {
  if (fs.existsSync(DEST_ABS)) fs.rmSync(DEST_ABS, { recursive: true });
}

function copyLibs(mode) {
  const sourceFiles = {
    development: [
      'node_modules/react/umd/react.development.js',
      'node_modules/react-dom/umd/react-dom.development.js',
      'node_modules/antd/dist/antd.min.js',
      'node_modules/antd/dist/antd.min.css',
    ],
    production: [
      'node_modules/react/umd/react.production.min.js',
      'node_modules/react-dom/umd/react-dom.production.min.js',
      'node_modules/antd/dist/antd.min.js',
      'node_modules/antd/dist/antd.min.css',
    ],
  };

  sourceFiles[mode].forEach((src) => {
    let target = src.replace(/.+\//, '').replace(/\..+\./, '.');
    src = path.resolve(ROOT_ABS, src);
    target = path.resolve(PUBLIC_ABS, target);
    fs.copyFileSync(src, target);
  });
}

function build(mode) {
  const entries = ['src/background/background.ts', 'src/content-view/content.tsx', 'src/options-view/options.tsx'];

  const tasks = entries.map((entry) => {
    const config = configFn({ mode });
    config.build.rollupOptions.input = path.resolve(config.root, entry);
    return vite.build({ ...config });
  });

  return Promise.all(tasks);
}

module.exports.clearDest = clearDest;

module.exports.buildProd = () => {
  clearDest();
  copyLibs(MODE.PROD);
  return build(MODE.PROD);
};

module.exports.buildDev = () => {
  copyLibs(MODE.DEV);
  return build(MODE.DEV);
};
