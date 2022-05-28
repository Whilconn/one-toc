const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  build: {
    lib: {
      entry: 'src/content.tsx',
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
