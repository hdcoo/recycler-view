import rollupPluginTs from '@wessberg/rollup-plugin-ts';

const banner = `/*!
 * recycler-view.js v1.0.0
 * (c) 2019-2020 hdcoo
 * Released under the MIT License.
 */`;

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/recycler-view.js',
      format: 'cjs',
      banner
    },
    plugins: [
      rollupPluginTs()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/recycler-view.esm.js',
      format: 'esm',
      banner
    },
    plugins: [
      rollupPluginTs()
    ]
  }
]
