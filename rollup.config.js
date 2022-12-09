import css from 'rollup-plugin-css-only';

import copy from 'rollup-plugin-copy';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    css({
      output: 'assets/camunda-form-playground.css'
    }),
    copy({
      targets: [
        { src: 'node_modules/@bpmn-io/form-js/dist/assets/**/*', dest: 'dist/assets' }
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
      '@bpmn-io/form-js',
      'classnames',
      'min-dash',
      'min-dom',
      'mitt',
      'diagram-js/lib/ui'
    ]
  }
];