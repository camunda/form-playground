import {
  createContext
} from 'preact';

export const LayoutContext = createContext({
  layout: {},
  setLayout: () => {},
  getLayoutForKey: () => {},
  setLayoutForKey: () => {}
});