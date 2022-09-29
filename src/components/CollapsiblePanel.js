import { html } from 'htm/preact';

import classNames from 'classnames';

import './CollapsiblePanel.css';

const noop = () => {};


export function CollapsiblePanel(props) {
  const {
    children,
    collapseTo,
    idx,
    onToggle,
    open,
    title
  } = props;

  const toggle = (event) => {
    event.stopPropagation();
    onToggle(open);
  };

  return html`
    <div 
      data-idx="${ idx }" 
      class="${classNames('cfp-collapsible-panel', { open: !collapseTo || open })}"
    >
      <div onClick="${ collapseTo ? toggle : noop }" class="cfp-collapsible-panel-title">
        <h1>${ title }</h1>

        ${ collapseTo && html`
          <div class="cfp-collapsible-panel-actions">
            <button 
              title="${ open ? 'Close' : 'Open' } ${ title }"
              class="cfp-collapsible-panel-action" 
              onClick="${ toggle }"
            >
              ${getIcon(collapseTo, open)}
            </button>
          </div>
        `}
      </div>

      <div class="cfp-collapsible-panel-content">
        ${ children }
      </div>
    </div>
  `;
}


// helper ////////////////

function getIcon(collapseTo, open) {
  if (collapseTo === 'right') {
    return open
      ? html`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.41421356,12.9494942 L3,11.5352806 L6.53553391,7.99974671 L3,4.4642128 L4.41421356,3.04999924 L9.36396103,7.99974671 L4.41421356,12.9494942 Z M9.91421356,3 L11.9142136,3 L11.9142136,13 L9.91421356,13 L9.91421356,3 Z"/>
      </svg>`
      : html`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M11.5,12.9494942 L6.55025253,7.99974671 L11.5,3.04999924 L12.9142136,4.4642128 L9.37867966,7.99974671 L12.9142136,11.5352806 L11.5,12.9494942 Z M6,3 L6,13 L4,13 L4,3 L6,3 Z"/>
      </svg>`;
  }

  if (collapseTo === 'bottom') {
    return open
      ? html`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M12.9494942,4.41421356 L7.99974671,9.36396103 L3.04999924,4.41421356 L4.4642128,3 L7.99974671,6.53553391 L11.5352806,3 L12.9494942,4.41421356 Z M3,9.91421356 L13,9.91421356 L13,11.9142136 L3,11.9142136 L3,9.91421356 Z"/>
      </svg>`
      : html`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M12.9494942,11.5 L11.5352806,12.9142136 L7.99974671,9.37867966 L4.4642128,12.9142136 L3.04999924,11.5 L7.99974671,6.55025253 L12.9494942,11.5 Z M3,6 L3,4 L13,4 L13,6 L3,6 Z"/>
      </svg>`;
  }
}