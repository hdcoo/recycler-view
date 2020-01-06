import rollupPluginTs from '@wessberg/rollup-plugin-ts';
import buble from "@rollup/plugin-buble";

const banner = `/*!
 * recycler-view.js v1.0.1
 * (c) 2019-2020 hdcoo
 * Released under the MIT License.
 */`;

const tsconfig = {
  target: 'es6',
  module: 'es6',
  declaration: true
};

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/recycler-view.js',
      format: 'cjs',
      banner
    },
    plugins: [
      rollupPluginTs({
        tsconfig,
        browserslist: false,
      }),
      buble()
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
      rollupPluginTs({
        tsconfig,
        browserslist: false
      }),
      buble()
    ]
  }
]
