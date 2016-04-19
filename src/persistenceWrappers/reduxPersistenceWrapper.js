import { INITIAL_FORM_STATE } from '../components/formalizeWrapper';
import { merge } from 'lodash';

// --------------------------------------------------
// Action creators

const createAction = type => payload => ({ type, payload });

export const INITIALIZE_FORM = 'formalizerActions.INITIALIZE_FORM';
export const initializeForm = createAction(INITIALIZE_FORM);

export const SET_FORMALIZER_STATE = 'formalizerActions.SET_FORMALIZER_STATE';
export const setFormalizerState = createAction(SET_FORMALIZER_STATE);

export const SET_FORM_FIELD_VALUE = 'formalizerActions.SET_FORM_FIELD_VALUE';
export const setFormFieldValue = createAction(SET_FORM_FIELD_VALUE);

// --------------------------------------------------
// Reducer

const defaultState = { forms: {} };

export function formalizerReducer(state = defaultState, action) {
  switch (action.type) {
    case INITIALIZE_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.formName]: state.forms[action.payload.formName] || INITIAL_FORM_STATE,
        },
      };

    case SET_FORMALIZER_STATE:
      console.log('old: ', state.forms[action.payload.formName]);
      console.log('new: ', action.payload.formState);
      console.log('merge', merge({}, state.forms[action.payload.formName], action.payload.formState));

      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.formName]: merge({}, state.forms[action.payload.formName], action.payload.formState),
        },
      };

    case SET_FORM_FIELD_VALUE:
      const form = state.forms[action.payload.formName];
      const field = form.fields[action.payload.fieldName];
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.formName]: {
            ...form,
            fields: {
              [action.payload.fieldName]: {
                ...field,
                value: action.payload.value,
              },
            },
          },
        },
      };

    default:
      return defaultState;
  }
}

// --------------------------------------------------
// Connect wrapper

import { connect } from 'react-redux';

// TODO Add extra param clearStateOnUnmount
export const createConnectWrapper = (formalizerBranchAccessor, formName) => connect(
  state => ({
    getFormalizerState: () => formalizerBranchAccessor(state).forms[formName] || INITIAL_FORM_STATE,
  }),
  dispatch => ({
    initializeForm: () => dispatch(initializeForm({ formName })),
    setFormFieldValue: ({ fieldName, value }) => dispatch(setFormFieldValue({
      formName,
      fieldName,
      value,
    })),
    setFormalizerState: state => dispatch(setFormalizerState({
      formState: state,
      formName,
    })),
  })
);
