import {
  CamundaFormPlayground
} from '@camunda/form-playground';

import schema from '../resources/form.json';

import './style.css';


const container = document.querySelector('.playground');

const designBtn = document.querySelector('.design');
const validateBtn = document.querySelector('.validate');
const checkA11yBtn = document.querySelector('.check-a11y');

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

let mode;
let a11yEnabled = false;

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

function toggleA11y() {
  a11yEnabled = !a11yEnabled;

  const form = formPlayground.getForm();
  const formEditor = formPlayground.getEditor();

  const onSchemaChanged = async () => {
    setTimeout(() => form.get('a11yValidation').execute(), 500);
  };

  if (a11yEnabled) {
    form.get('a11yValidation').execute();
    checkA11yBtn.classList.add('active');
    formEditor.on('changed', onSchemaChanged);
  } else {
    checkA11yBtn.classList.remove('active');
    formEditor.off('changed', onSchemaChanged);
    form.get('a11yValidation').clear();
  }
}

designBtn.addEventListener('click', triggerDesign);
validateBtn.addEventListener('click', triggerValidation);
checkA11yBtn.addEventListener('click', toggleA11y);

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