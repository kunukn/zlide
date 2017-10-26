import buble from 'rollup-plugin-buble';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    entry: 'src/assets/zlide.js',
    dest: pkg.browser,
    format: 'umd',
    // sourceMap: 'inline',
    moduleName: 'zlide',
    plugins: [
      buble({
        exclude: 'node_modules/**',
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    entry: 'src/assets/zlide.js',
    targets: [
      { dest: pkg.main, format: 'cjs' },
      { dest: pkg.module, format: 'es' },
    ],
  },
];
