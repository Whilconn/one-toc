const { defineConfig } = require('vite');
const config = require('./vite.config.prod');

module.exports = defineConfig({
  ...config,
  mode: 'development',
  build: { ...config.build, minify: false, sourcemap: 'inline', watch: {} },
});
