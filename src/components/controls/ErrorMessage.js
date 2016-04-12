import React from 'react';

const ErrorMessage = ({ fieldName }, { formalizer }) => {
  const field = formalizer.fields[fieldName];

  if (!field) {
    console.warn('Formalizer - ErrorMessage has no corresponding field: ', fieldName); // eslint-disable-line
  }

  return (
    field && field.errorMessageLabel
    ? field.errorMessageLabel
    : <span />
  );
};

ErrorMessage.contextTypes = {
  formalizer: React.PropTypes.object,
};

ErrorMessage.propTypes = {
  fieldName: React.PropTypes.string,
};

export default ErrorMessage;
