import React from 'react';

const connectForm = mapFormToProps => WrappedComponent => {
  const ConnectFormWrapper = (props, { getFormState }) =>
    (<WrappedComponent {...props} {...mapFormToProps(getFormState())} />);

  ConnectFormWrapper.contextTypes = {
    getFormState: React.PropTypes.func.isRequired,
  };

  return ConnectFormWrapper;
};

export default connectForm;
