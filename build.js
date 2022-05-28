const fs = require('fs');
const vite = require('vite');
const _ = require('lodash');
const viteConfigDev = require('./scripts/vite.config.dev');
const viteConfigProd = require('./scripts/vite.config.prod');

const env = (process.argv[2] || 'dev').toLowerCase();

const [SRC, DEST, PUBLIC] = ['src', 'dist', 'public'];

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

function copyReactLibs() {
  config.sourceFiles.forEach((src) => {
    let target = src.replace(/.+\//, '').replace(/\..+\./, '.');
    fs.copyFileSync(src, `${PUBLIC}/${target}`);
  });
}

function build() {
  const entries = ['src/content.tsx', 'src/popup.tsx'];
  for (const entry of entries) {
    const cfg = _.cloneDeep(config.viteConfig);
    cfg.build.lib = {
      ...cfg.build.lib,
      entry,
      name: 'OneToc',
      fileName: () => entry.replace(/^.+\//, '').replace(/[^.]+$/, 'js'),
    };
    vite.build(cfg).then();
  }
}

copyReactLibs();
build();
