import React from 'react';
import classNames from 'classnames';

import connectControl from '../connectControl';
import { VALID, INVALID, PENDING } from '../../constants/validationStates';
import { CHECKED, UNCHECKED } from '../../constants/checkboxStates';

function throwOnChangeMissing(fieldName) {
  throw new Error(
    `No onChange handler available for field "${fieldName}".`
    + ' The most likely explanation for this is that this input doesnt have a correpsonding'
    + 'field defined in the config.'
  );
}

const Input = (props) => {
  const { fieldName, className, type, value, getFormalizerField } = props;
  const field = getFormalizerField(fieldName);

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
        switch (type) {
          case 'radio':
            field.onChange(value);
            break;
          case 'checkbox':
            field.onChange(event.target.checked ? CHECKED : UNCHECKED);
            break;
          default:
            field.onChange(event.target.value);
        }
      },
    };

    if (!field.onChange) {
      throwOnChangeMissing(fieldName);
    }

    switch (type) {
      case 'radio':
        proxyProps.checked = field.value === value;
        break;

      case 'checkbox':
        proxyProps.checked = field.value === CHECKED;
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

Input.propTypes = {
  className: React.PropTypes.string,
  fieldName: React.PropTypes.string,
  type: React.PropTypes.string,
  value: React.PropTypes.string,
  getFormalizerField: React.PropTypes.func,
};

export default connectControl(Input);
