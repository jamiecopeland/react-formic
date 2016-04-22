import React from 'react';

import connectField from '../connectors/connectField';
import { fieldIsInvalid } from '../../utils/validationUtils';

const ErrorMessage = ({ field, component: WrappedComponent }) => {
  if (!field) {
    // TODO Add nicer message about where to add field
    console.warn(`Formic - ErrorMessage component has no corresponding field: ${fieldName}`); // eslint-disable-line
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

export default connectField()(ErrorMessage);
