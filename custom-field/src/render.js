import classNames from 'classnames';

/*
 * Import components and utilities from our extension API. Warning: for demo experiments only.
 */
const {
  Errors,
  FormContext,
  Numberfield,
  Description,
  Label
} = window['formJs'];

const {
  html,
  useContext
} = window['htmPreact'];

import RangeIcon from './range.svg';

const rangeType = 'range';

/*
 * This is the rendering part of the custom field. We use `htm` to
 * to render our components without the need of extra JSX transpilation.
 */
function RangeRenderer(props) {

  const {
    disabled,
    errors = [],
    field,
    readonly,
    value
  } = props;

  const {
    description,
    range = {},
    id,
    label
  } = field;

  const {
    min,
    max,
    step
  } = range;

  const { formId } = useContext(FormContext);

  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: Number(target.value)
    });
  };

  return html`<div class=${ formFieldClasses(rangeType) }>
    <${Label}
      id=${ prefixId(id, formId) }
      label=${ label } />
    <div class="range-group">
      <input
        type="range"
        disabled=${ disabled }
        id=${ prefixId(id, formId) }
        max=${ max }
        min=${ min }
        onInput=${ onChange }
        readonly=${ readonly }
        value=${ value }
        step=${ step } />
      <div class="range-value">${ value }</div>
    </div>
    <${Description} description=${ description } />
    <${Errors} errors=${ errors } id=${ errorMessageId } />
  </div>`;
}

/*
 * This is the configuration part of the custom field. It defines
 * the schema type, UI label and icon, palette group, properties panel entries
 * and much more.
 */
RangeRenderer.config = {

  /* we can extend the default configuration of existing fields */
  ...Numberfield.config,
  type: rangeType,
  label: 'Range',
  iconUrl: `data:image/svg+xml,${ encodeURIComponent(RangeIcon) }`,
  propertiesPanelEntries: [
    'key',
    'label',
    'description',
    'min',
    'max',
    'disabled',
    'readonly'
  ]
};

/*
 * This is the module definition of the custom field. This goes
 * into the Form instance via `additionalModules`.
 */
class CustomFormFields {
  constructor(formFields) {
    formFields.register(rangeType, RangeRenderer);
  }
}


export const renderExtension = {
  __init__: [ 'rangeField' ],
  rangeField: [ 'type', CustomFormFields ]
};

/**
 * DO NOT DELETE!
 * This one is important to load the extension in the form playground demo!
 */
window.renderExtensions = window.renderExtensions || [];
window.renderExtensions.push(renderExtension);


// helper //////////////////////

function formFieldClasses(type, { errors = [], disabled = false, readonly = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-has-errors': errors.length > 0,
    'fjs-disabled': disabled,
    'fjs-readonly': readonly
  });
}

function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${ formId }-${ id }`;
  }

  return `fjs-form-${ id }`;
}