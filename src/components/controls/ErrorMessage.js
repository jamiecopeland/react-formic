import React from 'react';

import connectField from '../connectors/connectField';
import { fieldIsInvalid } from '../../utils/validationUtils';

const ErrorMessage = props => {
  const { field, tag: Tag } = props;
  return fieldIsInvalid(field)
  ? <Tag {...props}>{field.validityMessage}</Tag>
  : null;
};

ErrorMessage.propTypes = {
  field: React.PropTypes.object.isRequired,
  tag: React.PropTypes.string.isRequired,
};

ErrorMessage.defaultProps = {
  tag: 'span',
};

export default connectField()(ErrorMessage);
