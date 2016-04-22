import React from 'react';
import classNames from 'classnames';

import connectField from '../connectors/connectField';
import { getValidityClassNames } from '../../utils/controlUtils';

const Input = props => {
  const { className, field, onChange } = props;

  const proxyProps = {
    ...props,
    className: classNames(className, getValidityClassNames(field)),
    onChange: event => {
      onChange(event.target.value);
    },
  };

  // Value defaults to an empty string to avoid an uncontrolled to controlled input warning.
  // See documentation: http://facebook.github.io/react/docs/forms.html#controlled-components
  proxyProps.value = field.value || '';

  return (
    <textarea {...proxyProps} />
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
