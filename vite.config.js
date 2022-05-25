import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';

const [SRC, DEST] = ['src', 'dist'];

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'OneToc',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    minify: false,
    sourcemap: 'inline',
    cssCodeSplit: true,
    watch: {
      include: SRC,
    },
    // rollupOptions: {
    //   external: ['react'],
    // },
  },
  plugins: [
    react(),
    copy({
      targets: [{ src: `${SRC}/manifest.json`, dest: DEST }],
    }),
  ],
});
