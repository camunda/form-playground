import {
  html,
  useEffect,
  useState
} from 'diagram-js/lib/ui';

import { PlaygroundComponent } from '../PlaygroundComponent';

import { WithTheme } from './withTheme';

import { FormCustomStyling } from './styles';

import { themes, THEME_TOKENS } from './themes';

import './CarbonizedFormEditor.css';


export function CarbonizedFormEditor(props) {

  const {
    emitter
  } = props;

  const [ themeKey, setThemeKey ] = useState(props.theme);

  const theme = themes[THEME_TOKENS[themeKey]];

  useEffect(() => {
    function handleThemeUpdate(context) {
      setThemeKey(context.theme);
    }

    emitter.on('formPlayground.updateTheme', handleThemeUpdate);

    return () => emitter.off('formPlayground.updateTheme', handleThemeUpdate);
  }, []);

  return html`
    <${WithTheme} theme="${theme}">
      ${ theme && html`<${FormCustomStyling}></${FormCustomStyling}>` }
      <div class="cfp-carbonized-container">
        <${PlaygroundComponent} ...${props}></${PlaygroundComponent}>
      </div>
    </${WithTheme}>
  `;
}

