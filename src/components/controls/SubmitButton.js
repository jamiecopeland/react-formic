import React from 'react';
import classNames from 'classnames';

import connectForm from '../connectors/connectForm';
import { formIsInvalid, formIsPending, formIsValid } from '../../utils/validationUtils';

const SubmitButton = (props) => {
  const { className, form, onClick, tag = 'a' } = props;
  const isValid = formIsValid(form);

  return (
    React.createElement(tag, {
      ...props,
      className: classNames(className, {
        invalid: formIsInvalid(form),
        pending: formIsPending(form),
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
