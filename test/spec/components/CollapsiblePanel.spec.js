import 'preact/debug';

import TestContainer from 'mocha-test-container-support';

import { fireEvent } from '@testing-library/preact';

import {
  render
} from '@testing-library/preact/pure';

import { html } from 'diagram-js/lib/ui';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import { CollapsiblePanel } from '../../../src/components/CollapsiblePanel';

import {
  expectNoViolations
} from '../../TestHelper';


describe('components/CollapsiblePanel', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should render', function() {

    // given
    const result = createCollapsiblePanel({ container });

    // then
    expect(domQuery('.cfp-collapsible-panel', result.container)).to.exist;
  });


  describe('toggle', function() {

    it('should allow initial configuration', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel', open: true });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;
    });


    it('should call handler', async function() {

      // given
      const spy = sinon.spy();

      const result = createCollapsiblePanel({ container, title: 'Panel', onToggle: spy });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const title = domQuery('.cfp-collapsible-panel-title', collapsiblePanel);

      // when
      await fireEvent.click(title);

      // then
      expect(spy).to.have.been.called;
    });


    it('should toggle open - title', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel' });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const title = domQuery('.cfp-collapsible-panel-title', collapsiblePanel);

      // assume
      expect(domClasses(collapsiblePanel).has('open')).to.be.false;

      // when
      await fireEvent.click(title);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;
    });


    it('should toggle close - title', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel', open: true });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const title = domQuery('.cfp-collapsible-panel-title', collapsiblePanel);

      // assume
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;

      // when
      await fireEvent.click(title);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.false;
    });


    it('should toggle open - action', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel' });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const action = domQuery('.cfp-collapsible-panel-action', collapsiblePanel);

      // assume
      expect(domClasses(collapsiblePanel).has('open')).to.be.false;

      // when
      await fireEvent.click(action);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;
    });


    it('should toggle close - action', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel', open: true });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const action = domQuery('.cfp-collapsible-panel-action', collapsiblePanel);

      // assume
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;

      // when
      await fireEvent.click(action);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.false;
    });


    it('should NOT toggle - no collapse config', async function() {

      // given
      const result = createCollapsiblePanel({ container, title: 'Panel', collapseTo: false });

      const collapsiblePanel = domQuery('.cfp-collapsible-panel', result.container);

      const title = domQuery('.cfp-collapsible-panel-title', collapsiblePanel);

      // assume
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;

      // when
      await fireEvent.click(title);

      // then
      expect(domClasses(collapsiblePanel).has('open')).to.be.true;
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container: node } = createCollapsiblePanel({
        container,
        title: 'Panel',
        open: true
      });

      // then
      await expectNoViolations(node);
    });

  });

});


// helper //////////////

function createCollapsiblePanel(options = {}) {
  const {
    container,
    collapseTo = 'bottom',
    open,
    ...restOptions
  } = options;

  let toggleState = !!open;
  let rerender;
  const onToggle = options.onToggle || function() {
    toggleState = !toggleState;
    rerender(html`
      <${CollapsiblePanel} open=${toggleState} collapseTo=${collapseTo} onToggle=${onToggle} ...${ restOptions } />
    `);
  };

  const component = render(html`
    <${CollapsiblePanel} open=${toggleState} collapseTo=${collapseTo} onToggle=${onToggle} ...${ restOptions } />
    `,
  {
    container
  }
  );

  rerender = component.rerender;

  return component;
}