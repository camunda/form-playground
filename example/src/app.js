import {
  CamundaFormPlayground
} from '@camunda/form-playground';

const LOCAL_STORAGE_PREFIX = 'FJS_PLAYGROUND_';

// imports for extensions //////////////////////

import * as Forms from '@bpmn-io/form-js';
import {
  html,
  useContext
} from 'diagram-js/lib/ui';
import * as PropertiesPanel from '@bpmn-io/properties-panel';

// end of imports for extensions //////////////////////

import UploadCustomFormElementModule from './palette';

import schema from '../resources/empty.json';

import './style.css';


const container = document.querySelector('.playground');

const designBtn = document.querySelector('.design');
const validateBtn = document.querySelector('.validate');

const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalFooterCloseBtn = document.querySelector('.modal-footer-close-btn');
const modalUploadBtn = document.querySelector('.modal-upload-btn');

const data = {};

let mode;

loadUtilties();
loadExtensionsFromStorage();
const extensions = getExtensions();

const formPlayground = new CamundaFormPlayground({
  container,
  schema,
  data,
  viewerProperties: {
    textLinkTarget: '_blank'
  },
  additionalModules: [
    ...extensions.additionalModules
  ],
  editorAdditionalModules: [
    UploadCustomFormElementModule,
    ...extensions.editorAdditionalModules
  ]
});

setMode('design');

formPlayground.on('formPlayground.layoutChanged', function(event) {
  console.log('layout updated', event.layout);
  setMode(isValidation(event.layout) ? 'validate' : 'design');
});

formPlayground.once('formPlayground.init', function() {
  formPlayground.open();
});

function setMode(value) {
  mode = value;

  if (mode === 'design') {
    designBtn.classList.add('active');
    validateBtn.classList.remove('active');
  } else {
    designBtn.classList.remove('active');
    validateBtn.classList.add('active');
  }
}

function triggerValidation() {
  setMode('validate');
  formPlayground.open();
}

function triggerDesign() {
  setMode('design');
  formPlayground.collapse();
}

designBtn.addEventListener('click', triggerDesign);
validateBtn.addEventListener('click', triggerValidation);

document.body.addEventListener('keydown', function(event) {
  if (event.code === 'KeyP' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    mode === 'design' ? triggerValidation() : triggerDesign();
  }
});

// Upload modal //////////////////////

function hideModal() {
  const modal = document.getElementById('upload-modal');
  modal.style.display = 'none';
}

modalCloseBtn.addEventListener('click', hideModal);
modalFooterCloseBtn.addEventListener('click', hideModal);

modalUploadBtn.addEventListener('click', function() {
  hideModal();

  const renderFile = document.getElementById('renderExtension').files[0];
  const propertiesPanelFile = document.getElementById('propertiesPanelExtension').files[0];
  const stylesFile = document.getElementById('styles').files[0];

  if (!renderFile && !propertiesPanelFile && !stylesFile) {
    return;
  }

  function readFile(type, file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      setFileInStorage(type, event.target.result);
      location.reload();
    };

    reader.readAsText(file);
  }

  renderFile && readFile('render', renderFile);
  propertiesPanelFile && readFile('propertiesPanel', propertiesPanelFile);
  stylesFile && readFile('styles', stylesFile);
});

// Local storage ////////////////////

function setFileInStorage(type, content) {
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${type}-${generateId()}`, content);
}

function loadExtensionsFromStorage() {

  function loadScripts(prefix) {
    const keys = Object.keys(localStorage).filter(function(key) {
      return key.startsWith(`${LOCAL_STORAGE_PREFIX}${prefix}`);
    });

    keys.forEach(function(key) {
      const content = localStorage.getItem(key);
      setJsExtension(content);
    });
  }

  function loadStyles(prefix) {
    const keys = Object.keys(localStorage).filter(function(key) {
      return key.startsWith(`${LOCAL_STORAGE_PREFIX}${prefix}`);
    });

    keys.forEach(function(key) {
      const content = localStorage.getItem(key);
      setCssExtension(content);
    });
  }

  loadScripts('render-');
  loadScripts('propertiesPanel-');
  loadStyles('styles-');
}

window.cleanupExtensions = function() {
  const keys = Object.keys(localStorage).filter(function(key) {
    return key.startsWith(LOCAL_STORAGE_PREFIX);
  });

  keys.forEach(function(key) {
    localStorage.removeItem(key);
  });
};

function setJsExtension(content) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = content;
  document.body.appendChild(script);
}

function setCssExtension(content) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = content;
  document.head.appendChild(style);
}

function getExtensions() {
  const renderExtensions = window.renderExtensions || [];
  const propertiesPanelExtensions = window.propertiesPanelExtensions || [];

  console.log('renderExtensions', renderExtensions);
  console.log('propertiesPanelExtensions', propertiesPanelExtensions);

  return {
    additionalModules: renderExtensions,
    editorAdditionalModules: propertiesPanelExtensions
  };
}

function loadUtilties() {
  window['formJs'] = {
    ...Forms
  };

  window['htmPreact'] = {
    html,
    useContext
  };

  window['propertiesPanel'] = {
    ...PropertiesPanel
  };
}


// helper ///////////

function isValidation(layout = {}) {
  return (
    (layout['form-preview'] || {}).open ||
    (layout['form-input'] || {}).open ||
    (layout['form-output'] || {}).open
  );
}

function generateId() {
  const S4 = function() {

    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}