import React from 'react';
import classNames from 'classnames';

import { VALID, INVALID, PENDING } from '../../constants/validationStates';

const SubmitButton = (props, { formalizer }) => {
  const { className, onClick, tag = 'a' } = props;
  const validity = formalizer.validity;
  return (
    React.createElement(tag, {
      ...props,
      className: classNames(className, {
        valid: validity === VALID,
        invalid: validity === INVALID,
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

SubmitButton.contextTypes = {
  formalizer: React.PropTypes.object,
};

SubmitButton.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  tag: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default SubmitButton;
