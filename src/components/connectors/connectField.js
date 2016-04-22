import React from 'react';

// The default implementation for mapping field values props.
export const defaultMapFieldValuesToProps = (field, onChange) => ({ field, onChange });

const connectControl = (mapFieldValuesToProps = defaultMapFieldValuesToProps) => WrappedComponent => {
  const ConnectControlWrapper = (props, { getFormFieldState, getFormFieldChangeHandler, store }) => {
    const { fieldName } = props;

    const fieldState = getFormFieldState(fieldName);
    const changeHandler = getFormFieldChangeHandler(fieldName);

    // const { fieldName } = props;
    // if (!fieldName) {
    //   throw new Error('Formic inputs require prop "fieldName"');
    // }

    // if (!fieldState) {
    //   throw new Error(
    //     `Formic cannot find a corresponding field for input with fieldName "${fieldName}". `
    //     + 'Check that the config for this form has a field defined by that name'
    //   );
    // }

    return (
      <WrappedComponent  {...props} {...mapFieldValuesToProps(fieldState, changeHandler)} />
    );
  };

  ConnectControlWrapper.contextTypes = {
    getFormFieldState: React.PropTypes.func.isRequired,
    getFormFieldChangeHandler: React.PropTypes.func.isRequired,

  };

  ConnectControlWrapper.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    store: React.PropTypes.object,
  };

  return ConnectControlWrapper;
};

export default connectControl;
