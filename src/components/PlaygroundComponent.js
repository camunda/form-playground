import {
  html,
  useEffect,
  useRef,
  useState
} from 'diagram-js/lib/ui';

import {
  assign,
  get,
  isArray,
  set
} from 'min-dash';

import classNames from 'classnames';

import { FormPlayground } from '@bpmn-io/form-js';

import { CollapsiblePanel } from './CollapsiblePanel';
import { CollapsedPreview } from './CollapsedPreview';

import {
  LayoutContext
} from '../context/LayoutContext';

import './PlaygroundComponent.css';

const DEFAULT_LAYOUT = {};

const FORM_DEFINITION_IDX = 'form-definition';
const FORM_PREVIEW_IDX = 'form-preview';
const FORM_INPUT_IDX = 'form-input';
const FORM_OUTPUT_IDX = 'form-output';

export const TOGGLABLE_CONTAINERS = [
  FORM_PREVIEW_IDX,
  FORM_INPUT_IDX,
  FORM_OUTPUT_IDX
];

const PIPE_EVENTS = [
  'formPlayground.init',
  'formPlayground.rendered'
];


export function PlaygroundComponent(props) {

  const {
    data,
    emitter,
    layoutConfig = {},
    onInit,
    schema,
    ...restProps
  } = props;

  let playgroundRef = useRef(null);

  const paletteContainerRef = useRef(null);
  const editorContainerRef = useRef(null);
  const dataContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const resultContainerRef = useRef(null);
  const propertiesContainerRef = useRef(null);

  const rootRef = useRef(null);

  // (1) initialize playground orchestrator
  useEffect(() => {
    playgroundRef.current = new FormPlayground({
      data,
      schema,
      editor: { inlinePropertiesPanel: false },
      propertiesPanel: {
        feelPopupContainer: rootRef.current,
        getDocumentationRef
      },
      ...restProps
    });
  }, []);

  // (1.1) pipe playground API
  useEffect(() => {
    playgroundRef.current.on('formPlayground.init', () => {
      onInit({
        ...playgroundRef.current,
        collapse: this.collapse,
        open: this.open,

        // @pinussilvestrus: this is added for testing purposes
        _ref: playgroundRef.current
      });
    });
  }, []);

  // (1.2) pipe core playground events
  useEffect(() => {
    const emit = (type, e) => {
      return emitter.emit(type, e);
    };

    PIPE_EVENTS.forEach(type => {
      playgroundRef.current.on(type, event => emit(type, event));
    });

    return () => {
      PIPE_EVENTS.forEach(type => {
        playgroundRef.current.off(type, event => emit(type, event));
      });
    };
  }, [ playgroundRef ]);

  // (2) set-up layout context
  const [ layout, setLayout ] = useState(createLayout(layoutConfig));

  const getLayoutForKey = (key, defaultValue) => {
    return get(layout, key, defaultValue);
  };

  const setLayoutForKey = (key, config) => {
    const newLayout = assign({}, layout);
    set(newLayout, key, config);
    setLayout(newLayout);
  };

  const layoutContext = {
    layout,
    setLayout,
    getLayoutForKey,
    setLayoutForKey
  };

  const inputOpen = getLayoutForKey([ FORM_INPUT_IDX, 'open' ], false);
  const toggleInput = () => {
    inputOpen ? this.collapse([ FORM_INPUT_IDX ]) : this.open([ FORM_INPUT_IDX ]);
  };

  const outputOpen = getLayoutForKey([ FORM_OUTPUT_IDX, 'open' ], false);
  const toggleOutput = () => {
    outputOpen ? this.collapse([ FORM_OUTPUT_IDX ]) : this.open([ FORM_OUTPUT_IDX ]);
  };

  const previewOpen = getLayoutForKey([ FORM_PREVIEW_IDX, 'open' ], false);
  const togglePreview = () => {
    previewOpen ? this.collapse() : this.open();
  };

  const setContainersLayout = (containers, open) => {
    let newLayout = assign({}, layout);

    if (!containers) {
      containers = TOGGLABLE_CONTAINERS;
    }

    if (!isArray(containers)) {
      containers = [ containers ];
    }

    containers.map(idx => {
      set(newLayout, [ idx, 'open' ], open);
    });

    setLayout(newLayout);
  };

  // (2.1) notify interested parties on layout changes
  useEffect(() => {
    emitter.emit('formPlayground.layoutChanged', { layout });
  }, [ emitter, layout ]);

  // (3) attach all component containers
  useEffect(() => {
    const playground = playgroundRef.current;

    function attachComponents() {
      playground.attachPaletteContainer(paletteContainerRef.current);
      playground.attachEditorContainer(editorContainerRef.current);
      playground.attachDataContainer(dataContainerRef.current);
      playground.attachPreviewContainer(previewContainerRef.current);
      playground.attachResultContainer(resultContainerRef.current);
      playground.attachPropertiesPanelContainer(propertiesContainerRef.current);
    }

    playground.on('formPlayground.rendered', attachComponents);

    return () => playground.off('formPlayground.rendered', attachComponents);
  }, []);

  // (4) provide toggle API

  /**
   * @param {string|Array<string>} [containers]
   */
  this.open = function(containers) {
    setContainersLayout(containers, true);
  };

  /**
   * @param {string|Array<string>} [containers]
   */
  this.collapse = function(containers) {
    return setContainersLayout(containers, false);
  };

  // (5) listen on dragging events to provide drop feedback
  useEffect(() => {

    const bindDropTargetListeners = () => {
      const editor = playgroundRef.current.getEditor();
      editor.on('drag.hover', function(event) {

        const { container } = event;

        if (
          container.classList.contains('fjs-drop-container-horizontal') ||
          container.classList.contains('fjs-drop-container-vertical')
        ) {
          rootRef.current && rootRef.current.classList.add('cfp-dragging');
        }
      });

      editor.on('drag.out', function(event) {
        rootRef.current && rootRef.current.classList.remove('cfp-dragging');
      });
    };

    const playground = playgroundRef.current;

    if (playground) {
      playground.on('formPlayground.rendered', bindDropTargetListeners);
    }

    return () => {
      if (playground) {
        playground.off('formPlayground.rendered', bindDropTargetListeners);
      }
    };
  });

  // (6) render
  return html`
    <${LayoutContext.Provider} value=${ layoutContext }>
    <div ref=${rootRef} class="${classNames('cfp-root', { 'cfp-open-preview': previewOpen })}">
      <div class="cfp-palette" ref=${ paletteContainerRef }></div>
      <div class="cfp-left">
        <${CollapsiblePanel} idx="${ FORM_DEFINITION_IDX }" title="Form Definition">
          <div class="cfp-editor-container" ref=${ editorContainerRef }></div>
        </${CollapsiblePanel}>
        <${CollapsiblePanel} open=${inputOpen} idx="${ FORM_INPUT_IDX }" title="Form Input" collapseTo="bottom" onToggle=${toggleInput}>
          <div class="cfp-data-container" ref=${ dataContainerRef }></div>
        </${CollapsiblePanel}>
      </div>
      <div class="cfp-right">
        <${CollapsedPreview} 
          idx=${ FORM_PREVIEW_IDX }
          open=${ previewOpen }
          previewContainerRef=${ previewContainerRef }
          onTogglePreview="${ togglePreview }" 
        />
        <${CollapsiblePanel} open=${outputOpen} idx="${ FORM_OUTPUT_IDX }" title="Form Output" collapseTo="bottom" onToggle=${toggleOutput}>
          <div class="cfp-result-container" ref=${ resultContainerRef }></div>
        </${CollapsiblePanel}>
      </div>
      <div class="cfp-properties" ref=${ propertiesContainerRef }></div>
    </div>
    </${LayoutContext.Provider}>
  `;
}


// helper ///////////////

function createLayout(overrides) {
  return {
    ...DEFAULT_LAYOUT,
    ...overrides
  };
}

function getDocumentationRef(field) {

  if (!field) {
    return;
  }

  if (field.type === 'default') {
    return 'https://docs.camunda.io/docs/components/modeler/forms/camunda-forms-reference/';
  }

  return `https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-${field.type}/`;
}