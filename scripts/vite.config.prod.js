const { defineConfig } = require('vite');
const path = require('path');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  root: path.resolve(__dirname, '..'),
  build: {
    lib: {
      entry: 'src/content/content.tsx',
      name: 'OneTocContent',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    emptyOutDir: false,
    cssCodeSplit: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [react()],
});
