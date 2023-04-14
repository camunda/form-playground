import {
  html
} from 'diagram-js/lib/ui';

import { ThemeProvider } from 'styled-components';

export function WithTheme(props) {
  const { theme } = props;

  if (!theme) {
    return html`${ props.children }`;
  }

  return html`<${ThemeProvider} theme="${theme}">${ props.children }</${ThemeProvider}>`;
}