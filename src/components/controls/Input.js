import React from 'react';
import classNames from 'classnames';

import { VALID, INVALID, PENDING } from '../../constants/validationStates';

const Input = (props, { formalizer }) => {
  const { fieldName, className, type, value } = props;
  const field = formalizer.fields[fieldName];

  let proxyProps;

  if (field) {
    proxyProps = {
      ...props,
      className: classNames(className, {
        invalid: field.validity === INVALID,
        pending: field.validity === PENDING,
        valid: field.validity === VALID,
      }),
      onChange: event => {
        event.persist();
        field.onChange(event);
      },
    };

    switch (type) {
      case 'radio':
        proxyProps.checked = field.value === value;
        break;

      case 'checkbox':
        proxyProps.checked = field.checked || false;
        break;

      default:
        // Value defaults to an empty string to avoid an uncontrolled to controlled input warning.
        // See documentation: http://facebook.github.io/react/docs/forms.html#controlled-components
        proxyProps.value = field.value || '';
    }
  } else {
    // TODO Add nicer message about where to add field
    console.warn(`Formalizer - Input component has no corresponding field: ${fieldName}`); // eslint-disable-line

    // Pass down inherited props to ensure styling works even if no field is available
    proxyProps = {
      ...props,
    };
  }



  return (
    <input {...proxyProps} />
  );
};

Input.contextTypes = {
  formalizer: React.PropTypes.object,
};

Input.propTypes = {
  // checked: React.PropTypes.bool,
  className: React.PropTypes.string,
  fieldName: React.PropTypes.string,
  type: React.PropTypes.string,
  value: React.PropTypes.string,
};

export default Input;
