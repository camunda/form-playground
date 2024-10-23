
import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  test: [ 'test/**/*.js' ],
  build: [ 'tasks/**/*.mjs', ],
  browser: [ 'src/**/*.js' ],
};

export default [
  {
    ignores: [ '**/public', '**/dist' ],
  },
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      files: files.browser
    };
  }),
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      files: files.build
    };
  }),
  ...bpmnIoPlugin.configs.mocha.map((config) => {
    return {
      ...config,
      files: files.test,
    };
  }),
  {
    languageOptions: {
      globals: {
        sinon: true,
      },
    },
    files: files.test,
  },
];
