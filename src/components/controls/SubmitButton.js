import React from 'react';
import classNames from 'classnames';

import connectForm from '../connectors/connectForm';
import { getFormValidity } from '../../utils/validationUtils';
import { INVALID, PENDING, VALID } from '../../constants/validity';

const SubmitButton = (props) => {
  const { className, children, form, onClick, tag: Tag } = props;
  const formValidity = getFormValidity(form);
  const isValid = formValidity === VALID;

  const proxyProps = {
    ...props,
    className: classNames(className, {
      invalid: formValidity === INVALID,
      pending: formValidity === PENDING,
      valid: isValid,
    }),
    disabled: !isValid,
    onClick: (event) => {
      if (isValid) {
        onClick(event);
      } else {
        event.preventDefault();
      }
    },
  };

  return (<Tag {...proxyProps}>{children}</Tag>);
};

SubmitButton.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  form: React.PropTypes.object,
  tag: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

SubmitButton.defaultProps = {
  tag: 'a',
};

export default connectForm(form => ({ form }))(SubmitButton);
