const path = require('path');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

const root = path.resolve(__dirname, '..');

const configFn = defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const buildOpts = isDev ? { minify: false, sourcemap: 'inline' } : {};
  const globals = {
    antd: 'antd',
    react: 'React',
    'react-dom': 'ReactDOM',
  };

  return {
    root,
    mode,
    build: {
      ...buildOpts,
      emptyOutDir: false,
      rollupOptions: {
        external: Object.keys(globals),
        input: '',
        output: {
          globals,
          format: 'iife',
          entryFileNames: '[name].js',
        },
      },
    },
    // 解决 micromatch 不兼容浏览器，出现 process is not defined 报错
    define: {
      process: {},
    },
    plugins: [react()],
  };
});

const [DEST, PUBLIC] = ['dist', 'public'];
const ROOT_ABS = root;
const DEST_ABS = path.resolve(ROOT_ABS, DEST);
const PUBLIC_ABS = path.resolve(ROOT_ABS, PUBLIC);

module.exports = { configFn, ROOT_ABS, DEST_ABS, PUBLIC_ABS };
