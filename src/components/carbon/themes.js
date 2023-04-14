import { g10, g100, styles } from '@carbon/elements';

const THEME_TOKENS = {
  light: 'g10',
  dark: 'g100',
};
const themes = {
  [THEME_TOKENS.light]: {
    ...g10,
    legal01: styles.legal01,
    legal02: styles.legal02,
  },
  [THEME_TOKENS.dark]: {
    ...g100,
    legal01: styles.legal01,
    legal02: styles.legal02,
  },
};

export { themes, THEME_TOKENS };
