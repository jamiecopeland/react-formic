import React from 'react';

import connectControl from '../connectControl';
import { INVALID } from '../../constants/validationStates';

const ErrorMessage = ({ fieldName, component: WrappedComponent, getFormalizerField }) => {
  const field = getFormalizerField(fieldName);

  if (!field) {
    // TODO Add nicer message about where to add field
    console.warn(`Formalizer - ErrorMessage component has no corresponding field: ${fieldName}`); // eslint-disable-line
  }

  return (
    field && field.validity === INVALID && field.validityMessage && WrappedComponent
    ? <WrappedComponent message={field.validityMessage} />
    : null
  );
};

ErrorMessage.propTypes = {
  fieldName: React.PropTypes.string.isRequired,
  component: React.PropTypes.func.isRequired,
  getFormalizerField: React.PropTypes.func.isRequired,
};

export default connectControl(ErrorMessage);
