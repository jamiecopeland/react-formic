import React from 'react';

// import classNames from 'classnames';
// import { VALID, INVALID, PENDING } from '../../constants/validationStates';

const Input = (props, { formalizer }) => {
  const { children, fieldName } = props;
  const field = formalizer.fields[fieldName];

  return (
    <select {...props} value={field.value} onChange={field.onChange}>
      {children}
    </select>
  );
};

Input.contextTypes = {
  formalizer: React.PropTypes.object,
};

Input.propTypes = {
  children: React.PropTypes.node, // TODO check this type is correct for <option />
  className: React.PropTypes.string,
  fieldName: React.PropTypes.string,
  value: React.PropTypes.string,
};

export default Input;
