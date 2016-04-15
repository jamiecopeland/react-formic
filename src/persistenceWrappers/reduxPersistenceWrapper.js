import { INITIAL_FORM_STATE } from '../components/formalizeWrapper';

// --------------------------------------------------
// Action creator

import { createAction } from 'redux-actions';

export const SET_FORMALIZER_STATE = 'formalizerActions.SET_FORMALIZER_STATE';
export const setFormalizerState = createAction(SET_FORMALIZER_STATE);

export const INITIALIZE_FORM = 'formalizerActions.INITIALIZE_FORM';
export const initializeForm = createAction(INITIALIZE_FORM);

// --------------------------------------------------
// Reducer

// import { handleActions } from 'redux-actions';
// import { Map } from 'immutable';

const defaultState = { forms: {} };

export function formalizerReducer(state = defaultState, action) {
  switch (action.type) {
    case INITIALIZE_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.formName]: INITIAL_FORM_STATE,
        },
      };

    case SET_FORMALIZER_STATE:
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.payload.formName]: action.payload.formState,
        },
      };

    default:
      return defaultState;
  }
}

// --------------------------------------------------
// Constants

export const DEFAULT_BRANCH_NAME = 'formalizer';

// --------------------------------------------------
// Connect wrapper

import { connect } from 'react-redux';

export const createConnectWrapper = (formalizerBranchName, formName) => {
  return connect(
    state => ({
      getFormalizerState: () => state.get(formalizerBranchName).forms[formName] || INITIAL_FORM_STATE // eslint-disable-line
    }),
    dispatch => ({
      setFormalizerState: state => dispatch(setFormalizerState({
        formState: state,
        formName,
      })),
      initializeForm: () => dispatch(initializeForm({ formName })),
    })
  );
};
