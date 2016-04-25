import React from 'react';
import { isEmail } from 'validator';
import {
  initialize,
  ErrorMessage,
  Input,
  SubmitButton,
  validity,
  checkboxStates,
} from 'react-formic';
import { connectLocalState } from 'react-formic/lib/stateWrappers/localStateWrapper';

import '../../../styles/form.css';
import './SignInForm.css';

const { INVALID, VALID } = validity;
const { CHECKED } = checkboxStates;

const formConfig = {
  stateWrapper: connectLocalState,
  fields: {
    email: {
      isRequired: true,
      valueStream: valueStream => valueStream
        .startWith('darth@deathstar.com')
        .map(value => value.toLowerCase()),
      validationStream: valueStream => valueStream
        .debounce(300)
        .map(value => ({
          validity: value && isEmail(value) ? VALID : INVALID,
          validityMessage: 'Must be a valid email',
        })),
    },
    recieveDarkSideEmail: {
      isRequired: true,
      validationStream: valueStream => valueStream
        .map(value => ({
          validity: value === CHECKED ? VALID : INVALID,
          validityMessage: 'Tick it or die!',
        })),
    },
  },
};

const SignInForm = () => (
  <div className="SignInForm">

    <div className="Form_Field">
      <div className="Form_Label">Email*</div>
      <Input
        className="Form_TextInput"
        fieldName="email"
        type="text"
      />
      <ErrorMessage className="Form_ErrorRight" fieldName="email" />
    </div>

    <div className="Form_Field">
      <div className="Form_Label">Confirmation*</div>
      <Input
        className="Form_Checkbox"
        fieldName="recieveDarkSideEmail"
        id="recieveDarkSideEmail"
        type="checkbox"
      />
      <label className="Form_CheckboxLabel" htmlFor="recieveDarkSideEmail">
        I would like to receive Dark Side of the Force newsletter
      </label>
      <ErrorMessage className="Form_ErrorRight" fieldName="recieveDarkSideEmail" />
    </div>
    <SubmitButton
      className="Form_SubmitButton"
      style={{ display: 'inline-block' }}
      tag="a"
      href="#"
      onClick={event => {
        event.preventDefault();
        console.log('Submit!'); // eslint-disable-line
      }}
    >Submit</SubmitButton>
  </div>
);

export default initialize(formConfig)(SignInForm);
