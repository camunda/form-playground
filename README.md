> :construction: Work in progress

# @camunda/form-playground

[![CI](https://github.com/camunda/form-playground/actions/workflows/CI.yml/badge.svg)](https://github.com/camunda/form-playground/actions/workflows/CI.yml)

Camunda Form Playground.

## Usage

Integrate the playground into your application:

```javascript
import { createCamundaFormPlayground } from 'camunda/form-playground';

const formPlayground = await createCamundaFormPlayground({
  container: document.querySelector('#container'),
  data,
  schema
});

// open preview
formPlayground.open();

// close preview
formPlayground.collapse();

// listen on editor events
const formEditor = formPlayground.getEditor();

formEditor.on('selection.changed', () => { ... });
```

## Styling

For proper styling include the necessary stylesheets, and font used:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://unpkg.com/@camunda/form-playground@0.1.0/dist/assets/form-js.css">
<link rel="stylesheet" href="https://unpkg.com/@camunda/form-playground@0.1.0/dist/assets/form-js-editor.css">
<link rel="stylesheet" href="https://unpkg.com/@camunda/form-playground@0.1.0/dist/assets/dragula.css">
<link rel="stylesheet" href="https://unpkg.com/@camunda/form-playground@0.1.0/dist/assets/properties-panel.css">
<link rel="stylesheet" href="https://unpkg.com/@camunda/form-playground@0.1.0/dist/assets/camunda-form-playground.css">
```

## API

### `createCamundaFormPlayground => Promise<Result, Error>`

Create a fully rendered form playground with options `{ container?: HTMLElement, data: any, exporter?: { name: String, version: String }, layout?: any, schema: any }`.

```javascript
import { createFormPlayground } from '@camunda/form-playground';

const formPlayground = await createFormPlayground({
  container: document.querySelector('#form-playground'),
  data,
  schema
});
```


### `CamundaFormPlayground`

Create a new form playground with options `{ container?: HTMLElement, data: any, exporter?: { name: String, version: String }, layout?: any, schema: any }`.

```javascript
import { CamundaFormPlayground } from '@camunda/form-playground';

const formPlayground = new CamundaFormPlayground({
  container: document.querySelector('#form-playground'),
  data,
  schema
});
```

### `CamundaFormPlayground#open(containers: String[]) => void`

Open all or specific playground containers.

```javascript
// open all
formPlayground.open();

// open specific
formPlayground.open([ 'form-preview' ]);
```

### `CamundaFormPlayground#collapse(containers: String[]) => void`

Collapse all or specific playground containers.

```javascript
// collapse all
formPlayground.collapse();

// collapse specific
formPlayground.collapse([ 'form-preview' ]);
```


### `CamundaFormPlayground#get(type: String, strict: Boolean) => any`

Get a service from the embedded form editor.

```javascript
const eventBus = formPlayground.get('eventBus');
```


### `CamundaFormPlayground#getEditor() => FormEditor`

Get the embedded form editor.

```javascript
const editor = formPlayground.getEditor();

editor.on('selection.changed', () => { ... });
```


### `CamundaFormPlayground#getSchema() => any`

Get the current form schema.


### `CamundaFormPlayground#setSchema(schema: any) => void`

Set the form schema.


### `CamundaFormPlayground#saveSchema() => any`

Export the form schema from the embedded form editor.

```javascript
const schema = formPlayground.saveSchema(schema);

console.log('exported schema', schema);
```


### `CamundaFormPlayground#attachTo(parent: HTMLElement) => void`


Attach the form playground to a parent node.


### `CamundaFormPlayground#detach() => void`


Detach the form playground from its parent node.


### `CamundaFormPlayground#fire(event) => void`

Fire an event.


### `CamundaFormPlayground#on(event, fn) => void`

Subscribe to an event.


### `CamundaFormPlayground#off(event, fn) => void`

Unsubscribe from an event.


### `CamundaFormPlayground#destroy() => void`

Remove form playground from the document.



## Hacking the Project

To get the development setup make sure to have [NodeJS](https://nodejs.org/en/download/) installed.
As soon as you are set up, clone the project and execute

```
npm install
npm start
```

## License

MIT
