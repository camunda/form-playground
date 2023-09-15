import UploadCustomFormElement from './components/UploadCustomFormElement';

export default class UploadCustomFormElementExtension {
  constructor(renderInjector) {
    renderInjector.attachRenderer('uploadCustomFormElement', UploadCustomFormElement);
  }
}

UploadCustomFormElementExtension.$inject = [ 'renderInjector' ];