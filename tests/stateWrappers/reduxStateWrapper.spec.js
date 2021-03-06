import chai, { expect } from 'chai';
import { Map } from 'immutable';
import chaiImmutable from 'chai-immutable';
import purdy from 'purdy';

chai.use(chaiImmutable);

import { Field, Form, Formic } from '../../src/data/stateTypes';
import {
  DELETE_FORM,
  INITIALIZE_FORM,
  SET_FORM_FIELD,
  SET_FORM_FIELDS,

  formicReducer,
} from '../../src/stateWrappers/reduxStateWrapper';
import { INVALID, VALID } from '../../src/constants/validity';

const stateEmpty = new Formic();
const statePopulated = new Formic({
  forms: Map({
    signUp: Form({
      fields: Map({
        firstName: new Field({
          isRequired: true,
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
          formName: 'signUp',
        },
      };
      const newState = formicReducer(statePopulated, action);
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
          formName: 'signUp',
        },
      };
      const newState = formicReducer(stateEmpty, action);
      expect(newState.getIn(['forms', action.payload.formName])).to.equal(action.payload.form);
    });
  });

  describe('SET_FORM_FIELD', () => {
    it('should replace field', () => {
      const action = {
        type: SET_FORM_FIELD,
        payload: {
          formName: 'signUp',
          field: {
            value: 'Darth',
          },
          fieldName: 'firstName',
          shouldReplace: true,
        },
      };

      const newState = formicReducer(statePopulated, action);
      const expectedState = statePopulated
        .setIn(
          ['forms', 'signUp', 'fields', 'firstName', 'value'],
          action.payload.field.value
        )
        .setIn(
          ['forms', 'signUp', 'fields', 'firstName', 'isRequired'],
          false
        );
      expect(newState).to.deep.equal(expectedState);
    });

    it('should merge into field', () => {
      const action = {
        type: SET_FORM_FIELD,
        payload: {
          formName: 'signUp',
          field: {
            validity: 'valid',
          },
          fieldName: 'firstName',
          shouldReplace: false,
        },
      };

      const newState = formicReducer(statePopulated, action);
      const expectedState = statePopulated.setIn(
        ['forms', 'signUp', 'fields', 'firstName', 'validity'],
        action.payload.field.validity
      );

      expect(newState).to.deep.equal(expectedState);
    });
  });

  describe('SET_FORM_FIELDS', () => {
    it('should set previously undefined field value', () => {
      const action = {
        type: SET_FORM_FIELDS,
        payload: {
          formName: 'signUp',
          fields: {
            firstName: {
              validity: VALID,
            },
          },
        },
      };

      const newState = formicReducer(statePopulated, action);
      const expectedState = statePopulated.setIn(
        ['forms', 'signUp', 'fields', 'firstName', 'validity'],
        action.payload.fields.firstName.validity
      );
      expect(newState).to.deep.equal(expectedState);
    });

    it('should set previously defined field value', () => {
      const action = {
        type: SET_FORM_FIELDS,
        payload: {
          formName: 'signUp',
          fields: {
            firstName: {
              value: 'Darth',
            },
          },
        },
      };

      const newState = formicReducer(statePopulated, action);
      const expectedState = statePopulated.setIn(
        ['forms', 'signUp', 'fields', 'firstName', 'value'],
        action.payload.fields.firstName.value
      );
      expect(newState).to.deep.equal(expectedState);
    });
  });
});
