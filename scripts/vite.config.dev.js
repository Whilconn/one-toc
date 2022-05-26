import fs from 'fs';
import { defineConfig } from 'vite';
import config from './vite.config.prod';

// copy react libs
fs.copyFileSync('node_modules/react/umd/react.development.js', 'public/react.js');
fs.copyFileSync('node_modules/react-dom/umd/react-dom.development.js', 'public/react-dom.js');

export default defineConfig({
  ...config,
  build: { ...config.build, minify: false, sourcemap: 'inline', watch: {} },
});
