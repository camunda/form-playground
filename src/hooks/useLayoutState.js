import {
  useContext,
  useEffect,
  useState
} from 'diagram-js/lib/ui';

import {
  LayoutContext
} from '../context/LayoutContext';

/**
 * Creates a state that persists in the global LayoutContext.
 *
 * @example
 * ```jsx
 * function Component(props) {
 *   const [ open, setOpen ] = useLayoutState([ 'containers', 'foo', 'open' ], false);
 * }
 * ```
 *
 * @param {(string|number)[]} path
 * @param {any} [defaultValue]
 *
 * @returns {[ any, Function ]}
 */
export function useLayoutState(path, defaultValue) {
  const {
    getLayoutForKey,
    setLayoutForKey
  } = useContext(LayoutContext);

  const layoutForKey = getLayoutForKey(path, defaultValue);
  const [ value, set ] = useState(layoutForKey);

  // react on global state changes
  useEffect(() => {
    set(layoutForKey);
  }, [ layoutForKey ]);

  const setState = (newValue) => {

    // (1) set component state
    set(newValue);

    // (2) set context
    setLayoutForKey(path, newValue);
  };

  return [ value, setState ];
}
