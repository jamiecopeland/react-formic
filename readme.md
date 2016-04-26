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

More documentation is on the way, but for now the quickest way to get going is to clone the repo and take a look at the examples app.

Install via NPM:

```
npm install react-formic
```

And a snippet showing how to construct a simple form:

```js
import React from 'react';
import { isEmail } from 'validator';
import {
  ErrorMessage,
  Input,
  SubmitButton,
	initialize,
  validity,
  checkboxStates,
} from 'react-formic';
import { connectLocalState } from 'react-formic/lib/stateWrappers/localStateWrapper';

const { INVALID, VALID } = validity;
const { CHECKED } = checkboxStates;

const config = {
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
    receiveDarkSideEmail: {
      isRequired: true,
      validationStream: valueStream => valueStream
        .map(value => ({
          validity: value === CHECKED ? VALID : INVALID,
          validityMessage: 'Tick it or die!',
        })),
    },
  },
};

const SignUpForm = () => (
  <div>
    <h2>Email*</h2>
    <Input
      fieldName="email"
      type="text"
    />
    <ErrorMessage fieldName="email" />

		<h2>Confirmation*</h2>
    <Input
      fieldName="receiveDarkSideEmail"
      id="receiveDarkSideEmail"
      type="checkbox"
    />
    I would like to receive the Dark Side of the Force newsletter
    <ErrorMessage fieldName="receiveDarkSideEmail" />

    <SubmitButton
      className="Form_SubmitButton"
      onClick={event => {
        console.log('Submit!');
      }}
    >Submit</SubmitButton>
  </div>
);

export default initialize(config)(SignUpForm);
```

##Roadmap
* Write documentation
* Add more extensive tests
* Some more exciting things
