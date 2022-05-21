import copy from 'rollup-plugin-copy';

const [SRC, DEST] = ['src', 'dist'];

export default {
  input: `${SRC}/content.js`,
  output: {
    dir: DEST,
    format: 'iife',
    watch: {
      include: SRC,
    },
  },
  plugins: [
    copy({
      targets: [{ src: `${SRC}/manifest.json`, dest: DEST }],
    }),
  ],
};
