const fs = require('fs');
const path = require('path');
const vite = require('vite');
const _ = require('lodash');
const { ROOT_ABS, DEST_ABS, PUBLIC_ABS } = require('./config');
const viteConfigDev = require('./vite.config.dev');
const viteConfigProd = require('./vite.config.prod');

const env = (process.argv[2] || 'dev').toLowerCase();

const CONFIG = {
  dev: {
    viteConfig: viteConfigDev,
    sourceFiles: ['node_modules/react/umd/react.development.js', 'node_modules/react-dom/umd/react-dom.development.js'],
  },
  prod: {
    viteConfig: viteConfigProd,
    sourceFiles: [
      'node_modules/react/umd/react.production.min.js',
      'node_modules/react-dom/umd/react-dom.production.min.js',
    ],
  },
};

const config = CONFIG[env];

function clearDest() {
  if (fs.existsSync(DEST_ABS)) fs.rmdirSync(DEST_ABS, { recursive: true });
}

function copyReactLibs() {
  config.sourceFiles.forEach((src) => {
    let target = src.replace(/.+\//, '').replace(/\..+\./, '.');
    src = path.resolve(ROOT_ABS, src);
    target = path.resolve(PUBLIC_ABS, target);
    fs.copyFileSync(src, target);
  });
}

function build() {
  const entries = {
    content: 'src/content/content.tsx',
    popup: 'src/popup/popup.tsx',
    background: 'src/background/background.ts',
  };
  for (const [key, entry] of Object.entries(entries)) {
    const cfg = _.cloneDeep(config.viteConfig);
    cfg.build.lib = {
      ...cfg.build.lib,
      entry,
      name: 'OneToc' + key[0].toUpperCase() + key.slice(1),
      fileName: () => key + '.js',
    };
    vite.build(cfg).then();
  }
}

clearDest();
copyReactLibs();
build();
