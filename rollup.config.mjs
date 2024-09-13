import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import resolve from '@rollup/plugin-node-resolve';

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
  ],
};
