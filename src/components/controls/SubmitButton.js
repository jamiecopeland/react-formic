import React from 'react';
import classNames from 'classnames';

import connectForm from '../connectForm';
import { VALID, INVALID, PENDING } from '../../constants/validationStates';

const SubmitButton = (props) => {
  const { className, form, onClick, tag = 'a' } = props;
  const validity = form.validity;

  return (
    React.createElement(tag, {
      ...props,
      className: classNames(className, {
        valid: validity === VALID,
        invalid: validity === INVALID, // TODO Add for level isDirty
        pending: validity === PENDING,
      }),
      disabled: validity !== VALID,
      onClick: (event) => {
        if (validity === VALID) {
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
