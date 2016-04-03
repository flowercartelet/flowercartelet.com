import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

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
    babel(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  ],
  sourceMap: true
};
