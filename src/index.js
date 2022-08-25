import { FormPlayground } from '@bpmn-io/form-js';

export function CamundaFormPlayground(options) {

  const {
    container,
    data,
    schema
  } = options;

  // todo(pinussilvestrus): replace me with proper preact component
  new FormPlayground({
    container,
    data,
    schema
  });
}