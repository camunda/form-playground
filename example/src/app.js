import {
  CamundaFormPlayground
} from '@camunda/form-playground';

import schema from '../resources/form.json';

import './style.css';


const container = document.querySelector('.container');

const data = {
  creditor: 'John Doe Company',
  amount: 456,
  invoiceNumber: 'C-123',
  approved: true,
  approvedBy: 'John Doe',
  mailto: [ 'regional-manager', 'approver' ],
  product: 'camunda-cloud',
  queriedDRIs: [
    {
      'label': 'John Doe',
      'value': 'johnDoe'
    },
    {
      'label': 'Anna Bell',
      'value': 'annaBell'
    },
    {
      'label': 'Nico Togin',
      'value': 'incognito'
    }
  ],
  tags: [ 'tag1', 'tag2', 'tag3' ],
  language: 'english'
};

new CamundaFormPlayground({
  container,
  schema,
  data
});