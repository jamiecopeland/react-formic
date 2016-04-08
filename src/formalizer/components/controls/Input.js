import React from 'react';
import classNames from 'classnames';

import { VALID, INVALID, PENDING } from '../../constants/validationStates';

const Input = (props, { formalizer }) => {
  const { fieldName, className, type, value } = props;
  const field = formalizer.fields[fieldName];

  const proxyProps = {
    ...props,
    className: classNames(className, {
      invalid: field.validity === INVALID,
      pending: field.validity === PENDING,
      valid: field.validity === VALID,
    }),
    onChange: event => {
      field.onChange(event);
    },
  };

  switch (type) {
    case 'radio':
      proxyProps.checked = field.value === value;
      break;
    default:
      proxyProps.value = field.value;
  }

  return (<input {...proxyProps} />);
};

Input.contextTypes = {
  formalizer: React.PropTypes.object,
};

Input.propTypes = {
  checked: React.PropTypes.bool,
  className: React.PropTypes.string,
  fieldName: React.PropTypes.string,
  type: React.PropTypes.string,
  value: React.PropTypes.string,
};

export default Input;
