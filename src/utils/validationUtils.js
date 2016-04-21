import { INVALID, PENDING, VALID } from '../constants/validationStates';

/**
 * Checks a value against multiple validators, returning either the first one to fail or an object
 * representing that the value is valid. Both the individual validators this method return objects
 * shaped as below:
 * {
 *   validity: VALID,
 * }
 * or
 * {
 *   validity: INVALID,
 *   validityMessage: 'Must be a valid email address',
 * }
 *
 * @param  {Array}  validators  A list of validators
 * @param  {*}      value       The value to be validated
 * @return {object} An object describing the validity
 */
export function validate(validators, value) {
  let output = { validity: VALID };

  for (const validator of validators) {
    const { validity, validityMessage } = validator(value);
    if (validity === INVALID) {
      output = { validity, validityMessage };
      break;
    }
  }

  return output;
}

export function shouldValidateField(field) {
  return field.isDirty || field.value;
}

export function fieldIsInvalid(field) {
  return field.validity === INVALID && shouldValidateField(field);
}

export function fieldIsPending(field) {
  return field.validity === PENDING && shouldValidateField(field);
}

export function fieldIsValid(field) {
  return field.validity === VALID && shouldValidateField(field);
}

export function allRequiredFieldsAreValid(fields) {
  return fields.every(field => (
    !(field.isDirty && field.validity === INVALID)
    &&
    (
      !field.isRequired
      ||
      (field.isRequired && field.validity === VALID)
    )
  ));
}

export function getFormValidity({ fields }) {
  return allRequiredFieldsAreValid(fields) ? VALID : INVALID;
}
