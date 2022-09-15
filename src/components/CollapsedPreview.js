import { html } from 'htm/preact';

import { CollapsiblePanel } from './CollapsiblePanel';

import './CollapsedPreview.css';

export function CollapsedPreview(props) {

  const {
    idx,
    onTogglePreview,
    previewContainerRef,
    open
  } = props;

  const onToggle = () => {
    onTogglePreview();
  };

  return !open
    ? html`<div class="cfp-collapsed-preview">
        <div class="cfp-collapsed-preview-title" onClick=${ onToggle }>
          <h1>Form Preview</h1>
        </div>
        <div class="cfp-collapsed-preview-actions">
          <button title="Open Form Preview" class="cfp-collapsed-preview-action" onClick=${ onToggle }>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.5,12.9494942 L6.55025253,7.99974671 L11.5,3.04999924 L12.9142136,4.4642128 L9.37867966,7.99974671 L12.9142136,11.5352806 L11.5,12.9494942 Z M6,3 L6,13 L4,13 L4,3 L6,3 Z"/>
            </svg>    
          </button>
        </div>
      </div>
    `
    : html`<${CollapsiblePanel} idx="${ idx }" open=${true} onToggle=${ onToggle } title="Form Preview" collapseTo="right">
        <div class="cfp-preview-container" ref=${ previewContainerRef }></div>
      </${CollapsiblePanel}>`;
}