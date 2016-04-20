import React from 'react';

import connectControl from '../connectControl';
import { fieldIsInvalid } from '../../utils/validationUtils';

const ErrorMessage = ({ field, component: WrappedComponent }) => {
  if (!field) {
    // TODO Add nicer message about where to add field
    console.warn(`Formalizer - ErrorMessage component has no corresponding field: ${fieldName}`); // eslint-disable-line
  }

  return (
    field && fieldIsInvalid(field) && field.validityMessage && WrappedComponent
    ? <WrappedComponent message={field.validityMessage} />
    : null
  );
};

ErrorMessage.propTypes = {
  field: React.PropTypes.object.isRequired,
  component: React.PropTypes.func.isRequired,
};

export default connectControl()(ErrorMessage);
