const { defineConfig } = require('vite');
const config = require('./vite.config.prod');

module.exports = defineConfig({
  ...config,
  build: { ...config.build, minify: false, sourcemap: 'inline', watch: {} },
});
