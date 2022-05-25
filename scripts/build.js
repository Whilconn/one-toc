const fs = require('fs');
const path = require('path');
const vite = require('vite');
const _ = require('lodash');
const viteConfigDev = require('./vite.config.dev');
const viteConfigProd = require('./vite.config.prod');

const env = (process.argv[2] || 'dev').toLowerCase();

const root = path.resolve(__dirname, '..');
const [DEST, PUBLIC] = ['dist', 'public'];

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
  fs.rmdirSync(path.resolve(root, DEST), { recursive: true });
}

function copyReactLibs() {
  config.sourceFiles.forEach((src) => {
    let target = src.replace(/.+\//, '').replace(/\..+\./, '.');
    src = path.resolve(root, src);
    target = path.resolve(root, `${PUBLIC}/${target}`);
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
