import { INITIAL_FORM_STATE } from '../components/formalizeWrapper';

// --------------------------------------------------
// Action creators

const createAction = type => payload => ({ type, payload });

export const SET_FORMALIZER_STATE = 'formalizerActions.SET_FORMALIZER_STATE';
export const setFormalizerState = createAction(SET_FORMALIZER_STATE);

export const INITIALIZE_FORM = 'formalizerActions.INITIALIZE_FORM';
export const initializeForm = createAction(INITIALIZE_FORM);

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
// Connect wrapper

import { connect } from 'react-redux';

export const createConnectWrapper = (formalizerBranchAccessor, formName) => connect(
  state => ({
    getFormalizerState: () => formalizerBranchAccessor(state).forms[formName] || INITIAL_FORM_STATE,
  }),
  dispatch => ({
    setFormalizerState: state => dispatch(setFormalizerState({
      formState: state,
      formName,
    })),
    initializeForm: () => dispatch(initializeForm({ formName })),
  })
);
