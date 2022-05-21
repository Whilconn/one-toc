import copy from 'rollup-plugin-copy';

const [SRC, DEST] = ['src', 'dist'];

export default {
  input: `${SRC}/content.js`,
  output: {
    file: `${DEST}/content.js`,
    format: 'iife',
  },
  plugins: [
    copy({
      targets: [{ src: `${SRC}/manifest.json`, dest: DEST }],
    }),
  ],
};
