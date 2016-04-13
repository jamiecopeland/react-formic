import React from 'react';

import { INVALID } from '../../constants/validationStates';

const ErrorMessage = ({ fieldName, type }, { formalizer }) => {
  const field = formalizer.fields[fieldName];

  if (!field) {
    // TODO Add nicer message about where to add field
    console.warn(`Formalizer - ErrorMessage component has no corresponding field: ${fieldName}`); // eslint-disable-line
  }

  const ErrorLabel = formalizer.errorLabelMap[type];

  if (!ErrorLabel) {
    console.warn(`Formalizer - ErrorMessage can't find error message label component matching key: ${type}`); // eslint-disable-line
  }

  return (
    field && field.validity === INVALID && field.validityWarning && ErrorLabel
    ? <ErrorLabel message={field.validityWarning} />
    : null
  );
};

ErrorMessage.contextTypes = {
  formalizer: React.PropTypes.object,
};

ErrorMessage.propTypes = {
  fieldName: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
};

export default ErrorMessage;
