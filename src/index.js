import {
  html,
  render
} from 'diagram-js/lib/ui';

import {
  query as domQuery,
  domify
} from 'min-dom';

import mitt from 'mitt';

import { PlaygroundComponent } from './components/PlaygroundComponent';

/**
 * @typedef { import('@bpmn-io/form-js-viewer').FormProperties } FormProperties
 * @typedef { import('@bpmn-io/form-js-editor').FormEditorProperties } FormEditorProperties
 *
 * @typedef { {
 *  container?: Element,
 *  data: any,
 *  editorAdditionalModules?: Array<any>,
 *  editorProperties?: FormEditorProperties
 *  exporter?: { name: string, version: string },
 *  layout?: any,
 *  propertiesPanel?: { parent: Element, feelPopupContainer: Element },
 *  schema: any,
 *  viewerAdditionalModules?: Array<any>,
 *  viewerProperties?: FormProperties,
 * } } CamundaFormPlaygroundOptions
 */

/**
 * @param {CamundaFormPlaygroundOptions} options
 */
export function CamundaFormPlayground(options) {

  const {
    container: parent,
    data,
    schema,
    layout: layoutConfig,
    ...restProps
  } = options;

  const emitter = mitt();

  const safeRef = function(fn) {
    return function(...args) {
      if (!playgroundRef) {
        throw new Error('Camunda Form Playground is not initialized.');
      }

      return fn(...args);
    };
  };

  const container = this._container = domify('<div class="cfp-container"></div>');

  let playgroundRef;

  if (parent) {
    parent.appendChild(container);
  }


  // API //////////

  this.on = emitter.on;
  this.off = emitter.off;
  this.fire = emitter.emit;

  // added due to current limitation of <mitt.once>
  // cf. https://github.com/developit/mitt/issues/136
  this.once = function(type, fn) {
    emitter.on(type, fn);
    emitter.on(type, emitter.off.bind(emitter, type, fn));
  };

  this.destroy = function() {
    const parent = container.parentNode;
    render(null, container);
    parent && parent.removeChild(container);
  };

  /**
   * @param {HTMLElement} parent
   */
  this.attachTo = function(parent) {
    if (!parent) {
      throw new Error('parent required');
    }

    if (typeof parent === 'string') {
      parent = domQuery(parent);
    }

    this.detach();
    parent.appendChild(this._container);
  };

  this.detach = function() {
    const parentNode = container.parentNode;

    if (parentNode) {
      parentNode.removeChild(container);
    }
  };

  this.get = safeRef((module, strict) => playgroundRef.get(module, strict));

  /**
   * @param {string|Array<string>} [containers]
   */
  this.open = safeRef((containers) => playgroundRef.open(containers));

  /**
   * @param {string|Array<string>} [containers]
   */
  this.collapse = safeRef((containers) => playgroundRef.collapse(containers));

  this.setSchema = safeRef((schema) => playgroundRef.setSchema(schema));

  this.getSchema = safeRef(() => playgroundRef.getSchema());

  this.saveSchema = safeRef(() => playgroundRef.saveSchema());

  this.getDataEditor = safeRef(() => playgroundRef.getDataEditor());

  this.getEditor = safeRef(() => playgroundRef.getEditor());

  this.getForm = safeRef((name, strict) => playgroundRef.getForm(name, strict));

  this.getResultView = safeRef(() => playgroundRef.getResultView());

  this._onInit = function(_ref) {
    playgroundRef = _ref;
  };

  render(html`
    <${PlaygroundComponent}
      data=${ data }
      emitter=${ emitter }
      layoutConfig=${ layoutConfig }
      onInit=${ this._onInit }
      schema=${ schema }
      ...${ restProps }
    />
  `, container
  );
}

/**
 * @param {CamundaFormPlaygroundOptions} options
 *
 * @return {CamundaFormPlayground}
 */
export async function createCamundaFormPlayground(options) {
  const playground = new CamundaFormPlayground(options);

  return new Promise((resolve, reject) => {

    const onInit = () => {
      return resolve(playground);
    };

    try {
      playground.once('formPlayground.init', onInit);
    } catch (err) {
      return reject(err);
    }
  });
}