import 'preact/debug';

import TestContainer from 'mocha-test-container-support';

import {
  waitFor
} from '@testing-library/preact/pure';

import {
  query as domQuery
} from 'min-dom';

import {
  CamundaFormPlayground,
  createCamundaFormPlayground
} from '../../src';

import schema from './form.json';

import {
  insertCSS,
  isSingleStart
} from '../TestHelper';

insertCSS('Test.css', `
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`);

const singleStart = isSingleStart('basic');


describe('CamundaFormPlayground', function() {

  let container, playground;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  !singleStart && afterEach(function() {
    if (playground) {
      playground.destroy();
      playground = null;
    }
  });


  (singleStart ? it.only : it)('should render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      queriedDRIs: [
        {
          'label': 'John Doe',
          'value': 'johnDoe'
        },
        {
          'label': 'Anna Bell',
          'value': 'annaBell'
        },
        {
          'label': 'Nico Togin',
          'value': 'incognito'
        }
      ],
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'english'
    };

    // when
    playground = new CamundaFormPlayground({
      container,
      schema,
      data
    });

    // then
    expect(playground).to.exist;

    expect(domQuery('.cfp-container', container)).to.exist;
  });


  it('should NOT attach to empty parent', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await waitFor(() => {
      new CamundaFormPlayground({
        schema,
        data
      });
    });

    const playgroundContainer = domQuery('.cfp-container', container);

    // then
    expect(domQuery('.cfp-root', playgroundContainer)).to.not.exist;
  });


  it('#get', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    await waitFor(async () => {
      playground = await createCamundaFormPlayground({
        container,
        data,
        schema
      });
    });

    // when
    const eventBus = playground.get('eventBus');

    // then
    expect(eventBus).to.exist;
  });


  describe('#attachTo', async function() {

    let parent;
    beforeEach(function() {
      parent = document.createElement('div');
      document.body.appendChild(parent);
    });

    afterEach(function() {
      document.body.removeChild(parent);
    });


    it('should attach', async function() {

      // given
      let playground;
      await waitFor(async () => {
        playground = new CamundaFormPlayground({
          schema
        });
      });

      // when
      playground.attachTo(parent);

      // then
      expect(domQuery('.cfp-root', container)).to.not.exist;
      expect(domQuery('.cfp-root', parent)).to.exist;
    });

  });


  it('should detach', async function() {

    // given
    let playground;
    await waitFor(async () => {
      playground = new CamundaFormPlayground({
        schema,
        container
      });
    });

    // assume
    expect(domQuery('.cfp-root', container)).to.exist;

    // when
    playground.detach(parent);

    // then
    expect(domQuery('.cfp-root', container)).to.not.exist;
  });


  it('should configure exporter', async function() {

    // given
    const exporter = {
      name: 'Foo',
      version: 'bar'
    };

    // when
    await waitFor(async () => {
      playground = await createCamundaFormPlayground({
        container,
        schema,
        exporter
      });
    });

    const editor = playground.getEditor();

    // then
    expect(editor.exporter).to.eql(exporter);
  });


  describe('emit core playground events', function() {

    it('<formPlayground.init>', async function() {

      // given
      const spy = sinon.spy();

      await waitFor(async () => {
        playground = await createCamundaFormPlayground({
          container
        });
      });

      playground.on('formPlayground.init', spy);

      // when
      await waitFor(() => playground.setSchema(schema));

      // then
      expect(spy).to.have.been.called;
    });


    it('<formPlayground.rendered>', async function() {

      // given
      const spy = sinon.spy();

      // when
      await waitFor(async () => {
        playground = await createCamundaFormPlayground({
          container
        });
      });

      playground.on('formPlayground.rendered', spy);

      const formEditor = playground.getEditor();
      formEditor.get('eventBus').fire('formEditor.rendered');

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('pipe playground API', function() {

    let formPlayground;

    beforeEach(async function() {
      const data = {
        creditor: 'foo'
      };

      await waitFor(async () => {
        formPlayground = await createCamundaFormPlayground({
          container,
          data,
          schema
        });
      });
    });

    afterEach(function() {
      formPlayground.destroy();
    });


    it('should throw when playground not initialized', function() {

      // given
      formPlayground = new CamundaFormPlayground({
        container,
        schema
      });

      // then
      expect(() => formPlayground.getEditor()).to.throw('Camunda Form Playground is not initialized.');
    });

    [
      'collapse',
      'getDataEditor',
      'getEditor',
      'getForm',
      'getResultView',
      'getSchema',
      'open',
      'saveSchema',
      'setSchema',
    ].forEach(function(method) {

      it(`should pipe ${method}`, function() {
        expect(formPlayground[method]()).to.not.throw;
      });

    });

  });

});