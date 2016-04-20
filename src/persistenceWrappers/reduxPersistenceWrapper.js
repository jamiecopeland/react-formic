import { connect } from 'react-redux';

import { Formalizer } from '../data/stateTypes';

// --------------------------------------------------
// Action creators

const createAction = type => payload => ({ type, payload });

export const DELETE_FORM = 'formalizer.DELETE_FORM';
export const deleteForm = createAction(DELETE_FORM);

export const INITIALIZE_FORM = 'formalizer.INITIALIZE_FORM';
export const initializeForm = createAction(INITIALIZE_FORM);

export const SET_FORM_FIELD = 'formalizer.SET_FORM_FIELD';
export const setFormField = createAction(SET_FORM_FIELD);

// --------------------------------------------------
// Reducer

const defaultState = Formalizer({});

function _deleteForm(state = defaultState, { payload: { formName } }) {
  return state.get('forms').delete(formName);
}

function _initializeForm(state = defaultState, { payload: { form, formName } }) {
  return state.setIn(['forms', formName], form);
}

function _setFormField(
  state = defaultState, { payload: { formName, field, fieldName, shouldReplace } }
) {
  return shouldReplace
    ? state.setIn(['forms', formName, 'fields', fieldName], field)
    : state.setIn(['forms', formName, 'fields', fieldName],
        state.getIn(['forms', formName, 'fields', fieldName]).merge(field));
}

const reducerMap = {
  [DELETE_FORM]: _deleteForm,
  [INITIALIZE_FORM]: _initializeForm,
  [SET_FORM_FIELD]: _setFormField,
};

export function formalizerReducer(state = defaultState, action) {
  const reducer = reducerMap[action.type];
  return reducer ? reducer(state, action) : state;
}

// --------------------------------------------------
// Connect wrapper

export const createConnectWrapper = (formalizerBranchAccessor, formName, clearOnUnmount) => connect(
  state => ({
    formState: formalizerBranchAccessor(state).getIn(['forms', formName]),
  }),
  dispatch => ({
    deleteForm: () => dispatch(deleteForm({ formName })),
    initializeForm: options => dispatch(initializeForm({ ...options, formName })),
    setFormField: options => dispatch(setFormField({ ...options, formName })),
    onUnmount: () =>
      clearOnUnmount
      ? dispatch(deleteForm({ formName }))
      : () => {},
  }),
);
