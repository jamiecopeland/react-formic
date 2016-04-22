import React from 'react';

import connectField from '../connectors/connectField';

const Select = props => {
  const { children, onChange } = props;
  const { field: { value } } = props;

  return (
    <select {...props} value={value} onChange={event => onChange(event.target.value)}>
      {children}
    </select>
  );
};

Select.propTypes = {
  children: React.PropTypes.node, // TODO check this type is correct for <option />
  className: React.PropTypes.string,
  field: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
};

export default connectField()(Select);
