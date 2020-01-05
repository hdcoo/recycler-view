import rollupPluginTs from '@wessberg/rollup-plugin-ts';
import buble from "@rollup/plugin-buble";

const banner = `/*!
 * recycler-view.js v1.0.1
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
      rollupPluginTs({
        browserslist: false,
        tsconfig: {
          target: 'es6'
        }
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
        browserslist: false,
        tsconfig: {
          target: 'es6'
        }
      }),
      buble()
    ]
  }
]
