import React from 'react';

const connectForm = mapFormToProps => WrappedComponent => {
  const ConnectFormWrapper = (props, { getFormalizerForm }) =>
    (<WrappedComponent {...props} {...mapFormToProps(getFormalizerForm())} />);

  ConnectFormWrapper.contextTypes = {
    getFormalizerForm: React.PropTypes.func.isRequired,
  };

  return ConnectFormWrapper;
};

export default connectForm;
