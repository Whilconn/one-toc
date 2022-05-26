import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// const [SRC, DEST, PUBLIC] = ['src', 'dist', 'public'];

// copy react libs
fs.copyFileSync('node_modules/react/umd/react.production.min.js', 'public/react.js');
fs.copyFileSync('node_modules/react-dom/umd/react-dom.production.min.js', 'public/react-dom.js');

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'OneToc',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
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
