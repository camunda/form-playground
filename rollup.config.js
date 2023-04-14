import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import alias from '@rollup/plugin-alias';

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
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: '../preact', replacement: 'preact' },
        { find: '../preact/hooks', replacement: 'preact/hooks' },
        { find: '../preact/jsx-runtime', replacement: 'preact/jsx-runtime' }
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
      '@bpmn-io/form-js/dist/carbon-styles',
      'classnames',
      'min-dash',
      'min-dom',
      'mitt',
      'diagram-js/lib/ui',
      'styled-components',
      '@carbon/elements',
      'preact/compat'
    ]
  }
];