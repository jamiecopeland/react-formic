import React from 'react';

import { fieldIsInvalid } from '../../utils/validationUtils';

// The default implementation for mapping field values props.
export const defaultMapFieldValuesToProps = (field) => ({ field });

const connectError = (mapFieldValuesToProps = defaultMapFieldValuesToProps) => WrappedComponent => {
  const ConnectErrorWrapper = (props, { getFormFieldState }) => {
    const { fieldName } = props;

    const field = getFormFieldState(fieldName);

    return (
      fieldIsInvalid(field)
        ? <WrappedComponent {...props} {...mapFieldValuesToProps(field)} />
        : null
    );
  };

  ConnectErrorWrapper.contextTypes = {
    getFormFieldState: React.PropTypes.func.isRequired,
  };

  ConnectErrorWrapper.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
  };

  return ConnectErrorWrapper;
};

export default connectError;
