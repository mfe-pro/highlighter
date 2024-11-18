import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

const isDev = process.env.ROLLUP_WATCH || process.env.NODE_ENV === 'development';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/highlighter.js',
    format: 'iife',
    name: 'MFEHighlighter',
  },
  plugins: [
    resolve(),
    typescript(),
    string({
      include: '**/*.css',
    }),
    ...(isDev
      ? [
          copy({
            targets: [
              { src: 'src/template.html', dest: 'dist', rename: 'index.html' },
            ],
          }),
          serve({
            open: true,
            contentBase: ['dist'],
            port: 3000,
          }),
          livereload({
            watch: 'dist',
          }),
        ]
      : []),
  ],
};
