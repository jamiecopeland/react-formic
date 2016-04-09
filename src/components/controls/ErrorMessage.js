import React from 'react';

const ErrorMessage = ({ fieldName }, { formalizer }) => {
  const field = formalizer.fields[fieldName];

  return (
    field.errorMessageLabel
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
