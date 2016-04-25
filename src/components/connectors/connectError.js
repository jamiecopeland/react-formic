import React from 'react';

import { INVALID } from '../../constants/validity';

// The default implementation for mapping field values props.
export const defaultMapFieldValuesToProps = (field) => ({ field });

const connectError = (mapFieldValuesToProps = defaultMapFieldValuesToProps) => WrappedComponent => {
  const ConnectErrorWrapper = (props, { getFormFieldState }) => {
    const { fieldName } = props;

    const fieldState = getFormFieldState(fieldName);

    return (
      fieldState.validity === INVALID
        ? <WrappedComponent {...props} {...mapFieldValuesToProps(fieldState)} />
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
