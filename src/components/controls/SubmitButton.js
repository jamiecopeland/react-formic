import React from 'react';
import classNames from 'classnames';

import connectForm from '../connectors/connectForm';
import { getFormValidity } from '../../utils/validationUtils';
import { INVALID, PENDING, VALID } from '../../constants/validationStates';

const SubmitButton = (props) => {
  const { className, form, onClick, tag = 'a' } = props;
  const formValidity = getFormValidity(form);
  const isValid = formValidity === VALID;

  return (
    React.createElement(tag, {
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
    })
  );
};

SubmitButton.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  form: React.PropTypes.object,
  tag: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default connectForm(form => ({ form }))(SubmitButton);
