import React from 'react';

import connectControl from '../connectControl';
import { INVALID } from '../../constants/validationStates';

const ErrorMessage = ({ fieldName, type, getFormalizerField, getFormalizerErrorLabel }) => {
  const field = getFormalizerField(fieldName);

  if (!field) {
    // TODO Add nicer message about where to add field
    console.warn(`Formalizer - ErrorMessage component has no corresponding field: ${fieldName}`); // eslint-disable-line
  }

  const ErrorLabel = getFormalizerErrorLabel(type);

  if (!ErrorLabel) {
    console.warn(`Formalizer - ErrorMessage can't find error message label component matching key: ${type}`); // eslint-disable-line
  }

  return (
    field && field.validity === INVALID && field.validityMessage && ErrorLabel
    ? <ErrorLabel message={field.validityMessage} />
    : null
  );
};

ErrorMessage.propTypes = {
  fieldName: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,

  getFormalizerField: React.PropTypes.func.isRequired,
  getFormalizerErrorLabel: React.PropTypes.func.isRequired,
};

export default connectControl(ErrorMessage);
