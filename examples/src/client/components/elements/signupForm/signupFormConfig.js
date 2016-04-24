import { isEmail, isLength } from 'validator';
import superagent from 'superagent';
import Rx from 'rx';
import { pipe } from 'ramda';

import { VALID, INVALID } from 'react-formic/lib/constants/validity';
import { FORMIC_BRANCH_NAME } from '../../../reducers/index';
import { connectRedux } from 'react-formic/lib/persistenceWrappers/reduxPersistenceWrapper';
import { connectLocalState } from 'react-formic/lib/persistenceWrappers/localStatePersistenceWrapper';
import { createStreamFromSuperagentRequest } from 'react-formic/lib/utils/rxUtils';
import { CHECKED } from 'react-formic/lib/constants/checkboxStates';

const TEXT_INPUT_DEBOUNCE_DURATION = 300;

// --------------------------------------------------
//

/**
 * Remove everything except numbers
 */
function reduceStringToNumbers(value) {
  return value.replace(/\D/g, '').slice(0, 16);
}

/**
 * Add a dash every fourth number character
 */
function addCreditCardDashes(value) {
  return value.toString().match(/(\d{0,4})/g).slice(0, -1).join('-');
}

/**
 * Checks whether or not a language exists in a list
 */
function languageExists(languages, languageId) {
  return languages.some(({ id }) => languageId === id);
}

export const genders = {
  FEMALE: 'female',
  MALE: 'male',
};

export const languages = [
  {
    id: 'english',
    name: 'English',
  },
  {
    id: 'french',
    name: 'French',
  },
];

export default {
  // persistenceWrapper: connectLocalState,
  persistenceWrapper: connectRedux(
    state => state.getIn([FORMIC_BRANCH_NAME]), 'signup', false
  ),
  fields: {

    // Mandatory and synchronous
    email: {


      // transform: value => value ? value.toLowerCase() : value,
      initialValues: {
        value: 'darth@deathstar.com',
        isRequired: true,
      },
      validate: (valueStream) => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => ({
          validity: value && isEmail(value) ? VALID : INVALID,
          validityMessage: 'Must be a valid email',
        })),

      // initialValue: 'darth@deathstar.com',
      // isRequired: true,
      // transform: value => value.toLowerCase(),
      // validate: (valueStream) => valueStream
      //   .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
      //   .map(value => ({
      //     validity: value && isEmail(value) ? VALID : INVALID,
      //     validityMessage: 'Must be a valid email',
      //   })),

      // isRequired: true,
      // transformStream: fieldStream => fieldStream
      //   .startWith({ value: 'darth@deathstar.com' })
      //   .map(({ value }) => ({ value: value.toLowerCase() })),
      // validateStream: (fieldStream) => fieldStream
      //   .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
      //   .map(({ value }) => ({
      //     validity: value && isEmail(value) ? VALID : INVALID,
      //     validityMessage: 'Must be a valid email',
      //   })),

      isRequired: true,
      valueStream: valueStream => valueStream
        .startWith('darth@deathstar.com'),
        // .map(value => value.toLowerCase()),
        // .do((value) => { console.log('value: ', value); }),
      validationStream: valueStream => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => ({
          validity: value && isEmail(value) ? VALID : INVALID,
          validityMessage: 'Must be a valid email',
        })),
    },

    userName: {
      // transform: value => value.toLowerCase(),
      validate: (valueStream) => valueStream
        .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
        .map(value => ({
          value,
          validity: (value && isLength(value, { min: 3, max: 10 })) ? VALID : INVALID,
          validityMessage: 'Must be between 3 and 10',
        }))
        .flatMapLatest(({ value, validity, validityMessage }) =>
            validity === INVALID
            ? Rx.Observable.of({ validity, validityMessage })
            : createStreamFromSuperagentRequest(
                superagent
                  .get('/api/user-name-exists')
                  .query({ userName: value }),
              )
              .map(response => ({
                validity: response.body.userNameExists ? INVALID : VALID,
                validityMessage: response.body.userNameExists
                  ? 'Username already exists'
                  : undefined,
              }))
        ),
    },

    // // Mandatory and synchronous
    // creditCardLongNumber: {
    //   transform: pipe(reduceStringToNumbers, addCreditCardDashes),
    //   validate: (valueStream) => valueStream
    //     .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
    //     .map(value => ({
    //       validity: value && reduceStringToNumbers(value).length === 16 ? VALID : INVALID,
    //       validityMessage: 'Must be a valid email',
    //     })),
    // },

    // billingAddressLine1: {
    //   validate: (valueStream, getFormState) => valueStream
    //     .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
    //     .map(value => {
    //       const billingAddressLine2 = getFormState()
    //         .getIn(['fields', 'billingAddressLine2', 'value']);
    //       const billingAddressPostcode = getFormState()
    //         .getIn(['fields', 'billingAddressPostcode', 'value']);
    //       return !!value || !!billingAddressLine2 || !!billingAddressPostcode
    //         ? {
    //           validity: value && isLength(value, { min: 2, max: 100 }) ? VALID : INVALID,
    //           validityMessage: 'Must be between 2 and 100 characters',
    //         }
    //         : {
    //           validity: undefined,
    //         };
    //     }),
    //   triggerFields: ['billingAddressLine2', 'billingAddressPostcode'],
    // },

    // billingAddressLine2: {
    //   validate: (valueStream, getFormState) => valueStream
    //     .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
    //     .map(value => {
    //       const billingAddressLine1 = getFormState()
    //         .getIn(['fields', 'billingAddressLine1', 'value']);
    //       const billingAddressPostcode = getFormState()
    //         .getIn(['fields', 'billingAddressPostcode', 'value']);
    //       return !!value || !!billingAddressLine1 || !!billingAddressPostcode
    //         ? {
    //           validity: value && isLength(value, { min: 2, max: 100 }) ? VALID : INVALID,
    //           validityMessage: 'Must be between 2 and 100 characters',
    //         }
    //         : {
    //           validity: undefined,
    //         };
    //     }),
    //   triggerFields: ['billingAddressLine1', 'billingAddressPostcode'],
    // },

    // billingAddressPostcode: {
    //   transform: value => value.toUpperCase(),
    //   validate: (valueStream, getFormState) => valueStream
    //     .debounce(TEXT_INPUT_DEBOUNCE_DURATION)
    //     .map(value => {
    //       const billingAddressLine1 = getFormState()
    //         .getIn(['fields', 'billingAddressLine1', 'value']);
    //       const billingAddressLine2 = getFormState()
    //         .getIn(['fields', 'billingAddressLine2', 'value']);
    //       return !!value || !!billingAddressLine1 || !!billingAddressLine2
    //         ? {
    //           validity: value && isLength(value, { min: 2, max: 9 }) ? VALID : INVALID,
    //           validityMessage: 'Must be between 2 and 9 characters',
    //         }
    //         : {
    //           validity: undefined,
    //         };
    //     }),
    //   triggerFields: ['billingAddressLine1', 'billingAddressLine2'],
    // },

    // // Optional but validate when has value
    // favouriteColor: {
    //   validate: valueStream => valueStream
    //     .map(value => ({
    //       validity: value // eslint-disable-line
    //         ? isLength(value, { min: 2, max: 100 }) ? VALID : INVALID
    //         : undefined,
    //       validityMessage: 'If present must be longer than 2 characters',
    //     })),
    // },


    // tweet: {
    //   validate: valueStream => valueStream
    //     .map(value => ({
    //       validity: value // eslint-disable-line
    //         ? isLength(value, { min: 1, max: 140 }) ? VALID : INVALID
    //         : undefined,
    //       validityMessage: 'Must be between 1 and 140 characters',
    //     })),
    // },

    // gender: {
    //   initialValues: {
    //     value: genders.FEMALE,
    //   },
    //   validate: valueStream => valueStream
    //     .map(value => ({
    //       validity: value === genders.FEMALE || value === genders.MALE ? VALID : INVALID,
    //       validityMessage: 'Must be one of a restricted number of options',
    //     })),
    // },

    // agreeTermsAndConditions: {
    //   initialValues: {
    //     isRequired: true,
    //   },
    //   validate: valueStream => valueStream
    //     .map(value => ({
    //       validity: value === CHECKED ? VALID : INVALID,
    //       validityMessage: 'You must agree to something',
    //     })),
    // },

    // language: {
    //   validate: valueStream => valueStream
    //     .map(value => ({
    //       validity: languageExists(languages, value) ? VALID : INVALID,
    //       validityMessage: 'You must select a language',
    //     })),
    // },
  },
};
