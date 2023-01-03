const fs = require('fs');
const path = require('path');
const vite = require('vite');
const { configFn, ROOT_ABS, DEST_ABS, PUBLIC_ABS } = require('./vite.config');
const pkg = require('../package.json');
const manifest = require('../public/manifest.json');

const MODE = { DEV: 'development', PROD: 'production' };

function clearDest() {
  if (fs.existsSync(DEST_ABS)) fs.rmSync(DEST_ABS, { recursive: true });
}

function copyLibs(mode) {
  let sourceFiles = {
    'react.js': 'node_modules/react/umd/react.production.min.js',
    'react-dom.js': 'node_modules/react-dom/umd/react-dom.production.min.js',
    'antd.js': 'node_modules/antd/dist/antd.min.js',
    'antd.css': 'node_modules/antd/dist/antd.min.css',
  };

  if (mode === MODE.DEV) {
    sourceFiles['react.js'] = 'node_modules/react/umd/react.development.js';
    sourceFiles['react-dom.js'] = 'node_modules/react-dom/umd/react-dom.development.js';
  }

  Object.entries(sourceFiles).forEach(([dest, src]) => {
    src = path.resolve(ROOT_ABS, src);
    dest = path.resolve(DEST_ABS, dest);
    fs.copyFileSync(src, dest);
  });
}

function genManifest() {
  const dest = path.resolve(DEST_ABS, 'manifest.json');
  const keys = ['version', 'description'];
  keys.forEach((k) => (manifest[k] = pkg[k]));

  fs.writeFileSync(dest, JSON.stringify(manifest, null, 2));
}

function build(mode) {
  const entries = ['src/background/background.ts', 'src/content-view/content.tsx', 'src/options-view/options.tsx'];

  const tasks = entries.map((entry) => {
    const config = configFn({ mode });
    // vite build({mode:'development'}) 时 process.env.NODE_ENV 仍然会被强制设置为 production，导致import.meta.env.MODE='development' 而 import.meta.env.DEV=false）
    // hack：强制改变 vite build 时的环境变量 process.env.NODE_ENV
    process.env.NODE_ENV = mode;
    config.build.rollupOptions.input = path.resolve(config.root, entry);
    return vite.build({ ...config });
  });

  return Promise.all(tasks);
}

module.exports.buildProd = async () => {
  clearDest();
  await build(MODE.PROD);
  copyLibs(MODE.PROD);
  genManifest();
};

module.exports.buildDev = async (clear) => {
  if (clear) clearDest();
  await build(MODE.DEV);
  copyLibs(MODE.DEV);
  genManifest();
};
