import {
  createContext
} from 'diagram-js/lib/ui';

export const LayoutContext = createContext({
  layout: {},
  setLayout: () => {},
  getLayoutForKey: () => {},
  setLayoutForKey: () => {}
});