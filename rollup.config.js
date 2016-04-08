import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));

babelrc['babelrc'] = false;
babelrc['presets'] = [
  'es2015-rollup',
  'react'
];

export default {
  dest: './asset/script.js',
  entry: './src/client.js',
  format: 'umd',
  plugins: [
    nodeResolve({
      browser: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel(babelrc),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  ],
  sourceMap: true
};
