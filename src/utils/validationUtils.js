import { INVALID, PENDING, VALID } from '../constants/validationStates';

export function runSynchronousValidators(validators, value) {
  let validity = VALID;
  let message;

  // TODO Tidy this with Array.some
  // Have to use old fashioned for loop because functional forEach loops can't be broken
  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    const validatorOutput = validator(value);

    if (validatorOutput.validity === INVALID) {
      validity = INVALID;
      message = validatorOutput.message;
      break;
    }
  }

  return { value, validity, validityMessage: message };
}

export function fieldIsValid(field) {
  return field.validity === VALID;
}

export function fieldIsInvalid(field) {
  return field.validity === INVALID && field.isDirty;
}

export function fieldIsPending(field) {
  return field.validity === PENDING;
}
