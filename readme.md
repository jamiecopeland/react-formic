# React Formic
Asynchronous form validation made easy.

##The problem

As soon as an application moves beyond simple asynchronous flows, callbacks and Promises start to struggle. This point arrives fairly quickly when trying to perfom complex form validations involving debouncing or server-side validation, with code quickly turning into hard to fathom spaghetti.

##The solution

[RxJS](https://github.com/Reactive-Extensions/RxJS) provides a rich and mature API for dealing with asynchronicity in JavaScript. For example, the two problems mentioned above can be solved in three extremely clear and declarative lines:

```js
userNameInputValueStream
.debounce(300)
.flatMapLatest(value => isUnique(value).map(response => response.body.userNameExists))
```

The stream above debounces the user name input and checks that it doesn't already exists on the server via the isUnique method that returns a stream containing the server's response. This value is then mapped to a boolean making it easy to consume for the application.

React Formic provides a way to leverage the features of RxJS in this problem space as well as providing an extensible API with default implementations for state storage using component state and Redux.

If you're unfamiliar with RxJS and functional reactive programming, make sure to check out this [excellent introduction](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) by Andre Staltz, author of [Cycle.js](http://cycle.js.org/).

##Quick start

More documentation is on the way, but for now take a look at the simple implementation below or for a more involved example, clone the project and run the examples application.

```js
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
