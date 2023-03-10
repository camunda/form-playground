import './test.css';

import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';

import axe from 'axe-core';

/**
 * https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
 */
const DEFAULT_AXE_RULES = [
  'best-practice',
  'wcag2a',
  'wcag2aa',
  'cat.semantics'
];

export function isSingleStart(topic) {

  // @ts-ignore-next-line
  return window.__env__ && window.__env__.SINGLE_START === topic;
}

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
}

export async function expectNoViolations(node, options = {}) {
  const {
    rules,
    ...rest
  } = options;

  const results = await axe.run(node, {
    runOnly: rules || DEFAULT_AXE_RULES,
    ...rest
  });

  expect(results.passes).to.be.not.empty;
  expect(results.violations).to.be.empty;
}