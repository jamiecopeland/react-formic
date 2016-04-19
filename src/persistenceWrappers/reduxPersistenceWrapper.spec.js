import { expect } from 'chai';
import chaiImmutable from 'chai-immutable';
import { Map, is } from 'immutable';
import purdy from 'purdy';

import {
  DELETE_FORMALIZER_FORM,
  INITIALIZE_FORMALIZER_FORM,
  SET_FORMALIZER_FIELD,

  Field,
  Form,
  Formalizer,
  formalizerReducer,
} from './reduxPersistenceWrapper';

const stateEmpty = new Formalizer();
const statePopulated = new Formalizer({
  forms: Map({
    signup: Form({
      fields: Map({
        firstName: new Field({
          value: 'Anakin',
        }),
      }),
    }),
    search: Form({
      fields: Map({
        queryString: new Field({
          value: 'new lightsabres',
        }),
      }),
    }),
  }),
});

describe('reduxPersistenceWrapper', () => {
  describe('DELETE_FORMALIZER_FORM', () => {
    it('should delete the form with the specified name', () => {
      const action = {
        type: DELETE_FORMALIZER_FORM,
        payload: {
          formName: 'signup',
        },
      };
      const newState = formalizerReducer(statePopulated, action);
      expect(newState.getIn(['forms', action.payload.formName])).to.equal(action.payload.form);
    });
  });

  describe('INITIALIZE_FORMALIZER_FORM', () => {
    it('should create a form with the specified name', () => {
      const action = {
        type: INITIALIZE_FORMALIZER_FORM,
        payload: {
          form: Form({
            fields: Map({
              firstName: Field({
                value: 'Anakin',
              }),
            }),
          }),
          formName: 'signup',
        },
      };
      const newState = formalizerReducer(stateEmpty, action);
      expect(newState.getIn(['forms', action.payload.formName])).to.equal(action.payload.form);
    });
  });

  describe('SET_FORMALIZER_FIELD', () => {
    it('should replace field', () => {
      const action = {
        type: SET_FORMALIZER_FIELD,
        payload: {
          formName: 'signup',
          field: Field({
            value: 'Darth',
          }),
          fieldName: 'firstName',
          shouldReplace: true,
        },
      };

      const newState = formalizerReducer(statePopulated, action);
      expect(is(newState.getIn(['forms', 'signup', 'fields', 'firstName']), action.payload.field))
        .to.equal(true);
    });

    it('should merge into field', () => {
      const action = {
        type: SET_FORMALIZER_FIELD,
        payload: {
          formName: 'signup',
          field: Map({
            validity: 'valid',
          }),
          fieldName: 'firstName',
          shouldReplace: false,
        },
      };

      const newState = formalizerReducer(statePopulated, action);
      const expectedField = new Field({
        value: statePopulated.getIn(['forms', 'signup', 'fields', 'firstName', 'value']),
        validity: action.payload.field.get('validity'),
      });

      expect(is(newState.getIn(['forms', 'signup', 'fields', 'firstName']), expectedField))
        .to.equal(true);
    });
  });
});
