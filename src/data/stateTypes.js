import { Map, Record } from 'immutable';

export const Field = Record({
  isDirty: undefined,
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
