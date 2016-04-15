import React from 'react';

export default function connectControl(WrappedComponent) {
  const ConnectControl = (props, { getFormalizerField }) => (
    <WrappedComponent {...props} getFormalizerField={getFormalizerField} />
  );

  ConnectControl.contextTypes = {
    getFormalizerField: React.PropTypes.func,
  };

  return ConnectControl;
}
