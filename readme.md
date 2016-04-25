# React Formic
Asynchronous form validation made easy

##Introduction
Callbacks are fine for handling simple events and Promises provide a nicer syntax as well as a [degree of composition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) but common problems in the development of forms such as debouncing text input and remote validation can quickly become troublesome and result in a lot of hard to fathom spaghetti which almost inevitably turns into bugs and a poor user experience.


##The solution

[RxJS](https://github.com/Reactive-Extensions/RxJS) provides a rich and mature API for dealing with asynchronicity in JavaScript, for example if a form contained a user name field which needed to be checked for uniqueness via a remote call, it can be clearly and declaratively expressed as follows (The output of this stream would be a boolean representing the validity):
```
userNameInputValueStream
.debounce(300)
.flatMapLatest(
	value => doRemoteValidation(value).map(response => response.body.userNameExists)
)
```

React Formic provides a way to leverage the useful features of RxJS in this problem space as well as providing an extensible API with default implementations for state storage using component state and Redux.

##Quick start

More explanation coming soon, but for now take a look at the simple implementation below or clone the project and run the examples application for a more fully featured demonstration of multiple input types and more complex validation.

```
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

```

##Roadmap
* Write documentation
* Write more extensive tests
