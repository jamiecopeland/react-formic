import React from 'react';

const connectControl = mapFieldToProps => WrappedComponent => {
  const ConnectControlWrapper = (props, { getFormalizerField }) => {
    const field = getFormalizerField(props.fieldName);

    if (!props.fieldName) {
      throw new Error('Formalizer inputs require prop "fieldName"');
    }

    if (!field) {
      throw new Error(
        `Formalizer cannot find a corresponding field for input with fieldName "${fieldName}". `
        + 'Check that the config for this form has a field defined by that name'
      );
    }

    return (
      <WrappedComponent {...props} {...mapFieldToProps(getFormalizerField(props.fieldName))} />
    );
  };

  ConnectControlWrapper.contextTypes = {
    getFormalizerField: React.PropTypes.func.isRequired,
  };

  ConnectControlWrapper.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
  };

  return ConnectControlWrapper;
};

export default connectControl;
