// --------------------------------------------------
// Action creator

import { createAction } from 'redux-actions';

export const SET_FORM_FIELD_VALUE = 'formalizerActions.SET_FORM_FIELD_VALUE';
export const setFormFieldValue = createAction(SET_FORM_FIELD_VALUE);

// --------------------------------------------------
// Reducer

import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

const defaultState = fromJS({});

export const formalizerReducer = handleActions({
  [SET_FORM_FIELD_VALUE]: (state = defaultState, action) => state.setIn(
    [
      action.payload.formId, 'fields', action.payload.fieldName, action.payload.propertyName,
    ],
    action.payload.value
  ),
}, defaultState);


// --------------------------------------------------
// Connect wrapper

import { connect } from 'react-redux';

export const createConnectWrapper = id => connect(
  state => ({
    getFormFieldValue: (fieldName, propertyName) =>
      state.getIn(['formalizer', id, 'fields', fieldName, propertyName]),
  }),
  dispatch => ({
    setFormFieldValue: (fieldName, propertyName, value) => dispatch(setFormFieldValue({
      formId: id,
      fieldName,
      propertyName,
      value,
    })),

  })
);
