import React from 'react';
import { formalize } from '../../../../formalizer';
import Input from '../../../../formalizer/components/controls/Input';
import Select from '../../../../formalizer/components/controls/Select';
import SubmitButton from '../../../../formalizer/components/controls/SubmitButton';
import ErrorMessage from '../../../../formalizer/components/controls/ErrorMessage';

import { default as formalizerConfig } from './signupFormFormalizerConfig';

import './SignupForm.css';

const languages = [
  {
    id: '',
    name: 'Please select a language',
  },
  {
    id: 'english',
    name: 'English',
  },
  {
    id: 'french',
    name: 'French',
  },
];

const SignupForm = () => (
  <div className="SignupForm">
    <h1 className="SignupForm-Title">SignupForm</h1>

      <div className="FormalizerField">
        <div className="FormalizerLabel">Email</div>
        <Input
          className="FormalizerTextInput"
          fieldName="email"
          type="text"
        />
        <ErrorMessage fieldName="email" />
      </div>

      <div className="FormalizerField">
        <div className="FormalizerLabel">UserName</div>
        <Input
          className="FormalizerTextInput"
          fieldName="userName"
          type="text"
        />
        <ErrorMessage fieldName="userName" />
      </div>

    <div className="FormalizerField">
      <div className="FormalizerLabel">Credit Card Number</div>
      <Input
        className="FormalizerTextInput"
        fieldName="creditCardLongNumber"
        type="text"
      />
      <ErrorMessage fieldName="creditCardLongNumber" />
    </div>

    <div className="FormalizerField">
      <div className="FormalizerLabel">Gender</div>
      <div>
        <Input
          className="FormalizerRadioButton"
          fieldName="gender"
          type="radio"
          name="gender"
          value="female"
        />Female
      </div>
      <div>
        <Input
          className="FormalizerRadioButton"
          fieldName="gender"
          type="radio"
          name="gender"
          value="male"
        />Male
      </div>
    </div>
    <ErrorMessage fieldName="gender" />

    <div className="FormalizerField">
      <div className="FormalizerLabel">Language</div>
      <Select className="FormalizerSelect" fieldName="language">
        {
          languages.map(language => {
            return (
              <option key={language.id} value={language.id}>{language.name}</option>
            )
          })
        }
      </Select>
      <ErrorMessage fieldName="language" />
    </div>

    <div>
      <SubmitButton
        className="FormalizerSubmitButton"
        tag="a"
        href="#"
        onClick={() => {
          console.log('heard the click');
        }}
      >Submit</SubmitButton>
    </div>


  </div>
);

SignupForm.propTypes = {
  formalizer: React.PropTypes.object,
};

export default formalize(formalizerConfig)(SignupForm);
