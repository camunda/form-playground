import { createGlobalStyle } from 'styled-components';

import {
  CARBON_STYLES
} from '@bpmn-io/form-js/dist/carbon-styles';

const FormCustomStyling = createGlobalStyle`
  ${CARBON_STYLES}
`;

export { FormCustomStyling };
