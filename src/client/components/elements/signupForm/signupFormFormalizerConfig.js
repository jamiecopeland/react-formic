import React from 'react';
import Rx from 'rx';
import superagent from 'superagent';
import { isEmail } from 'validator';
import { values } from 'ramda';

import { runSynchronousValidators } from '../../../../formalizer/utils/validationUtils';
import { createStreamFromSuperagentRequest } from '../../../../formalizer/utils/rxUtils';
import { VALID, INVALID } from '../../../../formalizer/constants/validationStates';
import * as genders from '../../../constants/genders';
import { createConnectWrapper } from '../../../../formalizer/persistenceWrappers/reduxPersistenceWrapper'; // eslint-disable-line
// import { wrap } from '../../../../formalizer/persistenceWrappers/localStatePersistenceWrapper';

function formatCreditCardOutput(value) {
  // console.log('value: ', value);
  const formattedValue = (value || '')
  .replace(/[^0-9]/g, '')// Limit to characters between 0 and 9
  .slice(0, 16); // Limit to 16 characters

  return (formattedValue.match((new RegExp('.{1,4}', 'g'))) || []).join('-');
}

const creditCardSynchronousValidators = [
  (value) => ({
    validity: value.length === 19 ? VALID : INVALID,
    message: 'Must be 16 characters',
  }),
];

const userNameSynchronousValidators = [
  (value) => ({
    validity: value.length > 3 ? VALID : INVALID,
    message: 'Must be more than three characters',
  }),
  (value) => ({
    validity: value.length < 10 ? VALID : INVALID,
    message: 'Must be less than ten characters',
  }),
];

const TEXT_INPUT_DEBOUNCE_DURATION = 200;

export default {
  persistenceWrapper: createConnectWrapper('signup'),
  // persistenceWrapper: wrap,
  createErrorMessageLabel: message => (message
    ? <span className="FormalizerErrorRight">{message}</span>
    : null),
  fields: {
    email: {
      createValidationStream: valueStream => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => ({
          validity: isEmail(value) ? VALID : INVALID,
          validityWarning: 'Invalid email',
        })),
    },
    creditCardLongNumber: {
      createValueStream: changeStream => changeStream
        .map(formatCreditCardOutput),
      createValidationStream: valueStream => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => runSynchronousValidators(creditCardSynchronousValidators, value)),
    },
    userName: {
      createValidationStream: valueStream => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => runSynchronousValidators(userNameSynchronousValidators, value))
        .flatMapLatest(({ validity, validityWarning, value }) => (validity === INVALID
          ? Rx.Observable.of({ validity, validityWarning })
          : createStreamFromSuperagentRequest(
              superagent
                .get('/api/user-name-exists')
                .query({ userName: value }),
            )
            .map(response => ({
              validity: response.body.userNameExists ? INVALID : VALID,
              validityWarning: response.body.userNameExists ? 'Username already exists' : undefined,
            }))
        )),
    },
    gender: {
      createValidationStream: valueStream => valueStream.map(value => ({
        validity: values(genders).includes(value) ? VALID : INVALID,
        validityWarning: 'Please select a gender',
      })),
    },
    language: {
      createValidationStream: valueStream => valueStream.map(value => ({
        validity: value === '' ? INVALID : VALID,
        validityWarning: 'You must select a country',
      })),
    },
  },

};
