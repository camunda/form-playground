import 'preact/debug';

import TestContainer from 'mocha-test-container-support';

import { fireEvent } from '@testing-library/preact';

import {
  render
} from '@testing-library/preact/pure';

import { html } from 'diagram-js/lib/ui';

import {
  query as domQuery
} from 'min-dom';

import { CollapsedPreview } from '../../../src/components/CollapsedPreview';

import {
  expectNoViolations
} from '../../TestHelper';

const noop = () => {};


describe('components/CollapsedPreview', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should render - collapsed', function() {

    // given
    const result = createCollapsedPreview({ container, open: false });

    // then
    expect(domQuery('.cfp-collapsed-preview', result.container)).to.exist;
  });

  it('should render - open', function() {

    // given
    const result = createCollapsedPreview({ container, open: true });

    // then
    expect(domQuery('.cfp-collapsible-panel', result.container)).to.exist;
  });


  it('should invoke toggle callback', async function() {

    // given
    const onToggleSpy = sinon.spy();

    const result = createCollapsedPreview({ container, onTogglePreview: onToggleSpy });

    const title = domQuery('.cfp-collapsed-preview-title', result.container);

    // when
    await fireEvent.click(title);

    // then
    expect(onToggleSpy).to.have.been.called;
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container: node } = createCollapsedPreview({
        container,
        open: true
      });

      // then
      await expectNoViolations(node);
    });

  });

});


// helper //////////////

function createCollapsedPreview(options = {}) {
  const {
    container,
    onTogglePreview = noop,
    ...restOptions
  } = options;

  return render(html`
    <${CollapsedPreview} onTogglePreview=${onTogglePreview} ...${ restOptions } />`,
  {
    container
  }
  );
}