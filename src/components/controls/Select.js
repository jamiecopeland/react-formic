import React from 'react';

import connectControl from '../connectControl';

const Select = props => {
  const { children } = props;
  const { field: { value, onChange } } = props;

  return (
    <select {...props} value={value} onChange={event => onChange(event.target.value)}>
      {children}
    </select>
  );
};

Select.contextTypes = {
  formalizer: React.PropTypes.object,
};

Select.propTypes = {
  children: React.PropTypes.node, // TODO check this type is correct for <option />
  className: React.PropTypes.string,
  field: React.PropTypes.object,
  value: React.PropTypes.string,
};

export default connectControl(field => ({ field }))(Select);
