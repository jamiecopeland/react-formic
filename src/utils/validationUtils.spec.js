import 'babel-polyfill';
import { expect } from 'chai';

import { INVALID, VALID } from '../constants/validationStates';
import { validate } from './validationUtils';

describe('validationUtils', () => {
  describe('validate', () => {
    const validateMinLengthMessage = 'Too short';
    function validateMinLength(value) {
      return {
        validity: value && value.length > 1 ? VALID : INVALID,
        validityMessage: validateMinLengthMessage,
      };
    }

    const validateMaxLengthMessage = 'Too long';
    function validateMaxLength(value) {
      return {
        validity: value && value.length < 3 ? VALID : INVALID,
        validityMessage: validateMaxLengthMessage,
      };
    }

    const validators = [validateMinLength, validateMaxLength];

    it('should return invalid at validator index 0', () => {
      const { validity, validityMessage } = validate(validators, 'a');
      expect(validity).to.equal(INVALID);
      expect(validityMessage).to.equal(validateMinLengthMessage);
    });

    it('should return invalid at validator index 0 + n', () => {
      const { validity, validityMessage } = validate(validators, 'abcde');
      expect(validity).to.equal(INVALID);
      expect(validityMessage).to.equal(validateMaxLengthMessage);
    });

    it('should return valid', () => {
      const { validity, validityMessage } = validate(validators, 'ab');
      expect(validity).to.equal(VALID);
      expect(validityMessage).to.equal(undefined);
    });

    it('should return valid with no validators', () => {
      const { validity, validityMessage } = validate([], undefined);
      expect(validity).to.equal(VALID);
      expect(validityMessage).to.equal(undefined);
    });
  });
});
