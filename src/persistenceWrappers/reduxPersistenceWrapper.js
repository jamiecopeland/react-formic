import { Map, Record } from 'immutable';

// --------------------------------------------------
// Action creators

const createAction = type => payload => ({ type, payload });

export const DELETE_FORMALIZER_FORM = 'formalizerActions.DELETE_FORMALIZER_FORM';
export const deleteForm = createAction(DELETE_FORMALIZER_FORM);

export const INITIALIZE_FORMALIZER_FORM = 'formalizerActions.INITIALIZE_FORMALIZER_FORM';
export const initializeForm = createAction(INITIALIZE_FORMALIZER_FORM);

export const SET_FORMALIZER_FIELD = 'formalizerActions.SET_FORMALIZER_FIELD';
export const setFormField = createAction(SET_FORMALIZER_FIELD);

// --------------------------------------------------
// Immutable stuff

export const Field = Record({
  value: undefined,
  validity: undefined,
  validityMessage: undefined,
});

export const Form = Record({
  fields: Map({}),
  validity: undefined,
});

export const Formalizer = Record({
  forms: Map({}),
});

// --------------------------------------------------
// Reducer

const defaultState = Formalizer({});

function deleteFormalizerForm(state = defaultState, { payload: { formName } }) {
  return state.forms.delete(formName);
}

function initializeFormalizerForm(state = defaultState, { payload: { form, formName } }) {
  return state.setIn(['forms', formName], form);
}

function setFormalizerField(
  state = defaultState, { payload: { formName, field, fieldName, shouldReplace } }
) {
  return shouldReplace
    ? state.setIn(['forms', formName, 'fields', fieldName], field)
    : state.setIn(['forms', formName, 'fields', fieldName],
        state.getIn(['forms', formName, 'fields', fieldName]).merge(field));
}

const reducerMap = {
  [DELETE_FORMALIZER_FORM]: deleteFormalizerForm,
  [INITIALIZE_FORMALIZER_FORM]: initializeFormalizerForm,
  [SET_FORMALIZER_FIELD]: setFormalizerField,
};

export function formalizerReducer(state = defaultState, action) {
  const reducer = reducerMap[action.type];
  return reducer ? reducer(state, action) : state;
}

// --------------------------------------------------
// Connect wrapper

import { connect } from 'react-redux';

// TODO Add extra param clearStateOnUnmount
export const createConnectWrapper = (formalizerBranchAccessor, formName) => connect(
  state => ({
    formState: formalizerBranchAccessor(state).getIn(['forms', formName]),
  }),
  dispatch => ({
    deleteForm: () => dispatch(initializeForm({ formName })),
    initializeForm: options => dispatch(initializeForm({ ...options, formName })),
    setFormField: options => dispatch(setFormField({ ...options, formName })),
  }),
);
