import css from 'rollup-plugin-css-only';

import copy from 'rollup-plugin-copy';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    css({
      output: 'assets/playground.css'
    }),
    copy({
      targets: [
        { src: 'node_modules/@bpmn-io/form-js/dist/assets/**/*.css', dest: 'dist/assets' }
      ]
    }),
    ...plugins
  ];

}

export default [
  {
    input: 'src/index.js',
    output: [
      {
        sourcemap: true,
        format: 'commonjs',
        file: pkg.main
      },
      {
        sourcemap: true,
        format: 'esm',
        file: pkg.module
      }
    ],
    plugins: pgl(),
    external: [
      'preact',
      'preact/hooks',
      'htm',
      '@bpmn-io/form-js'
    ]
  }
];