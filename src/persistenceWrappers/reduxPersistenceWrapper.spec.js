import { expect } from 'chai';
import { Map, is } from 'immutable';

import { Field, Form, Formalizer } from '../data/stateTypes';
import {
  DELETE_FORM,
  INITIALIZE_FORM,
  SET_FORM_FIELD,

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
  describe('DELETE_FORM', () => {
    it('should delete the form with the specified name', () => {
      const action = {
        type: DELETE_FORM,
        payload: {
          formName: 'signup',
        },
      };
      const newState = formalizerReducer(statePopulated, action);
      expect(newState.getIn(['forms', action.payload.formName])).to.equal(action.payload.form);
    });
  });

  describe('INITIALIZE_FORM', () => {
    it('should create a form with the specified name', () => {
      const action = {
        type: INITIALIZE_FORM,
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

  describe('SET_FORM_FIELD', () => {
    it('should replace field', () => {
      const action = {
        type: SET_FORM_FIELD,
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
        type: SET_FORM_FIELD,
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
