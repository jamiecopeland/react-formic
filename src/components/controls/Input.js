import React from 'react';
import classNames from 'classnames';

import connectField from '../connectors/connectField';
import { CHECKED, UNCHECKED } from '../../constants/checkboxStates';
import { getValidityClassNames } from '../../utils/controlUtils';

const Input = (props) => {
  const { className, type, value, field, onChange } = props;

  const proxyProps = {
    ...props,
    className: classNames(className, getValidityClassNames(field)),
    onChange: event => {
      switch (type) {
        case 'radio':
          onChange(value);
          break;
        case 'checkbox':
          onChange(event.target.checked ? CHECKED : UNCHECKED);
          break;
        default:
          onChange(event.target.value);
      }
    },
  };

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

  return (
    <input {...proxyProps} />
  );
};

Input.propTypes = {
  className: React.PropTypes.string,
  field: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
};

Input.defaultProps = {
  field: require('immutable').Map,
};

export default connectField()(Input);
