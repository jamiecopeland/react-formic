import classNames from 'classnames';
import { fieldIsInvalid, fieldIsPending, fieldIsValid } from './validationUtils';

export function getValidityClassNames(field) {
  return classNames({
    invalid: fieldIsInvalid(field),
    pending: fieldIsPending(field),
    valid: fieldIsValid(field),
  });
}
