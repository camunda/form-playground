import {
  CamundaFormPlayground
} from '@camunda/form-playground';

import schema from '../resources/form.json';

import './style.css';


const container = document.querySelector('.playground');

const designBtn = document.querySelector('.design');
const validateBtn = document.querySelector('.validate');

const data = {
  'request': {
    'id': '0010549221',
    'item': 'New Notebook',
    'image': 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_99397903/fee_325_225_png',
    'requester': 'John Doe',
    'amount': 2400
  },
  'selectedCategories': [ 'hardware' ],
  'approved': false
};

let mode;

const formPlayground = new CamundaFormPlayground({
  container,
  schema,
  data
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


// helper ///////////

function isValidation(layout = {}) {
  return (
    (layout['form-preview'] || {}).open ||
    (layout['form-input'] || {}).open ||
    (layout['form-output'] || {}).open
  );
}