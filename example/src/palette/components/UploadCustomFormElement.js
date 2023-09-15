import { html } from 'diagram-js/lib/ui';

function UploadCustomFormElement(props) {

  const { components } = props;
  const { Fill } = components;

  const showModal = () => {
    const modal = document.getElementById('upload-modal');
    modal.style.display = 'block';
  };

  /* Note: this only works in the playground demo! */
  const removeCustomFormFields = () => {
    window.cleanupExtensions();
    location.reload();
  };

  return html`
    <${Fill} slot="editor-palette__footer">
      <div class="upload-component-button-container">
        <button onClick=${showModal} class="primary">Upload</button>
        <button onClick=${removeCustomFormFields}>Clean</button>
      </div>
    </${Fill}>
  `;
}

export default UploadCustomFormElement;