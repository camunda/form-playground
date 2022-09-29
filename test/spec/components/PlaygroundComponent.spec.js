import 'preact/debug';

import TestContainer from 'mocha-test-container-support';

import mitt from 'mitt';

import {
  fireEvent,
  render,
  waitFor
} from '@testing-library/preact/pure';

import { html } from 'htm/preact';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import { PlaygroundComponent } from '../../../src/components/PlaygroundComponent';

import {
  expectNoViolations
} from '../../TestHelper';

const noop = () => {};

const defaultSchema = {
  components: [
    {
      key: 'creditor',
      label: 'Creditor',
      type: 'textfield',
      description: 'foo',
      validate: {
        required: true
      }
    }
  ]
};

const defaultData = {
  creditor: 'foo'
};


describe('components/PlaygroundComponent', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  it('should render', async function() {

    // given
    let result;
    await waitFor(() => {
      result = createPlaygroundComponent({ container });
    });

    // then
    expect(domQuery('.cfp-root', result.container)).to.exist;
  });


  it('#open', async function() {

    // given
    const onInit = (playground) => {
      playground.open();
    };
    let result;
    await waitFor(() => {
      result = createPlaygroundComponent({ container, onInit });
    });

    // then
    expect(isOpen(getPanel('form-definition', result.container))).to.be.true;
    expect(isOpen(getPanel('form-preview', result.container))).to.be.true;
    expect(isOpen(getPanel('form-input', result.container))).to.be.true;
    expect(isOpen(getPanel('form-output', result.container))).to.be.true;
  });


  it('#collapse', async function() {

    // given
    const onInit = (playground) => {
      playground.open();
      playground.collapse();
    };
    let result;
    await waitFor(() => {
      result = createPlaygroundComponent({ container, onInit });
    });

    // then
    expect(isOpen(getPanel('form-definition', result.container))).to.be.true;
    expect(isOpen(getPanel('form-preview', result.container))).to.be.false;
    expect(domQuery('.cfp-collapsed-preview', result.container)).to.exist;
    expect(isOpen(getPanel('form-input', result.container))).to.be.false;
    expect(isOpen(getPanel('form-output', result.container))).to.be.false;
  });


  it('should attach components', async function() {

    // given
    let ref;
    const paletteSpy = sinon.spy();
    const editorSpy = sinon.spy();
    const previewSpy = sinon.spy();
    const inputSpy = sinon.spy();
    const outputSpy = sinon.spy();
    const propertiesPanelSpy = sinon.spy();

    const onInit = (playground) => {
      playground._ref.attachPaletteContainer = paletteSpy;
      playground._ref.attachEditorContainer = editorSpy;
      playground._ref.attachPreviewContainer = previewSpy;
      playground._ref.attachDataContainer = inputSpy;
      playground._ref.attachResultContainer = outputSpy;
      playground._ref.attachPropertiesPanelContainer = propertiesPanelSpy;
      ref = playground;
    };

    await waitFor(() => {
      createPlaygroundComponent({ container, onInit });
    });

    // when
    await waitFor(() => {
      ref.emit('formPlayground.rendered');
      ref.open();
    });

    // then
    expect(paletteSpy).to.have.been.called;
    expect(editorSpy).to.have.been.called;
    expect(previewSpy).to.have.been.called;
    expect(inputSpy).to.have.been.called;
    expect(outputSpy).to.have.been.called;
    expect(propertiesPanelSpy).to.have.been.called;
  });


  describe('integration', function() {

    it('should toggle input', async function() {

      // given
      let result;
      await waitFor(() => {
        result = createPlaygroundComponent({ container });
      });

      const inputPanel = getPanel('form-input', result.container);
      const title = domQuery('.cfp-collapsible-panel-title', inputPanel);

      // assume
      expect(isOpen(inputPanel)).to.be.false;

      // when
      await fireEvent.click(title);

      // then
      expect(isOpen(inputPanel)).to.be.true;
    });


    it('should toggle preview', async function() {

      // given
      let result;
      await waitFor(() => {
        result = createPlaygroundComponent({ container });
      });

      const collapsedPreview = domQuery('.cfp-collapsed-preview', result.container);
      const previewPanel = getPanel('form-input', result.container);
      const title = domQuery('.cfp-collapsed-preview-title', collapsedPreview);

      // assume
      expect(isOpen(previewPanel)).to.be.false;

      // when
      await fireEvent.click(title);

      // then
      expect(isOpen(previewPanel)).to.be.true;
    });


    it('should toggle output', async function() {

      // given
      let result;
      await waitFor(() => {
        result = createPlaygroundComponent({ container });
      });

      const outputPanel = getPanel('form-output', result.container);
      const title = domQuery('.cfp-collapsible-panel-title', outputPanel);

      // assume
      expect(isOpen(outputPanel)).to.be.false;

      // when
      await fireEvent.click(title);

      // then
      expect(isOpen(outputPanel)).to.be.true;
    });

  });


  describe('layout context', function() {

    it('should notify on layout changed', async function() {

      // given
      const spy = sinon.spy();

      const emitter = mitt();

      let ref;
      const onInit = (playground) => {
        ref = playground;
        playground._ref.attachPreviewContainer = noop;
        playground._ref.attachResultContainer = noop;
      };

      await waitFor(() => {
        createPlaygroundComponent({ container, emitter, onInit });
      });

      emitter.on('formPlayground.layoutChanged', spy);

      // when
      await waitFor(() => {
        ref.open();
      });

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      let node;

      await waitFor(() => {
        const result = createPlaygroundComponent({ container });

        node = result.container;
      });

      // then
      await expectNoViolations(node);
    });

  });

});


// helper //////////////

function createPlaygroundComponent(options = {}) {

  const events = mitt();

  const {
    container,
    data = defaultData,
    emitter = events,
    onInit = noop,
    schema = defaultSchema,
    ...restOptions
  } = options;

  return render(html`
    <${PlaygroundComponent} 
      data=${data}
      emitter=${emitter}
      onInit=${onInit}
      schema=${schema}
      ...${ restOptions } />`,
  {
    container
  }
  );
}

function getPanel(idx, container) {
  return domQuery(`.cfp-collapsible-panel[data-idx="${idx}"]`, container);
}

function isOpen(node) {
  return domClasses(node).contains('open');
}