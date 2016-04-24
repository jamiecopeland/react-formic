import React from 'react';
import {
  initialize,
  ErrorMessage,
  Input,
  Select,
  SubmitButton,
  TextArea,
} from 'react-formic';

import signupFormConfig, { genders, languages } from './signupFormConfig';

import './SignupForm.css';
import '../../../styles/form.css';

// --------------------------------------------------
// Error labels

const errorPropTypes = {
  message: React.PropTypes.string,
};

const FieldErrorRightContent = ({ message }) => (<span className="FormErrorRight">{message}</span>);
FieldErrorRightContent.propTypes = errorPropTypes;

const FieldErrorBottomContent = ({ message }) => (
  <div className="FormErrorBottom">
    <div className="FormErrorBottom_Message">{message}</div>
  </div>
);
FieldErrorBottomContent.propTypes = errorPropTypes;

const FieldErrorRight = props => (<ErrorMessage {...props} component={FieldErrorRightContent} />);
// const FieldErrorBottom = props =>
//  (<ErrorMessage {...props} component={FieldErrorBottomContent} />);

// --------------------------------------------------
// Form

const languagesWithCTA = [
  {
    id: '',
    name: 'Please select a language',
  },
  ...languages,
];

const TWEET_LENGTH = 140;

const SignupForm = ({ form }) => {
  return (
  <div className="SignupForm">
    <h1 className="SignupForm-Title">SignupForm</h1>
      <div className="FormField">
        <div className="FormLabel">Email*</div>
        <Input
          className="FormTextInput"
          fieldName="email"
          type="text"
        />
        <FieldErrorRight fieldName="email" />
        <div className="FormExplanation">Debounced validation</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">UserName*</div>
        <Input
          className="FormTextInput"
          fieldName="userName"
          type="text"
        />
        <FieldErrorRight fieldName="userName" />
        <div className="FormExplanation">Remote api check for uniquness</div>
      </div>

      {/*

      <div className="FormField">
        <div className="FormLabel">Credit Card Number*</div>
        <Input
          className="FormTextInput"
          fieldName="creditCardLongNumber"
          type="text"
        />
        <FieldErrorRight fieldName="creditCardLongNumber" />
        <div className="FormExplanation">Value restriction and transformation</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Billing address line 1</div>
        <Input
          className="FormTextInput"
          fieldName="billingAddressLine1"
          type="text"
        />
        <FieldErrorRight fieldName="billingAddressLine1" />
        <div className="FormExplanation">Validity relating to prescence of other address fields</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Billing address line 2</div>
        <Input
          className="FormTextInput"
          fieldName="billingAddressLine2"
          type="text"
        />
        <FieldErrorRight fieldName="billingAddressLine2" />
        <div className="FormExplanation">Validity relating to prescence of other address fields</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Billing address postcode</div>
        <Input
          className="FormTextInput"
          fieldName="billingAddressPostcode"
          type="text"
        />
        <FieldErrorRight fieldName="billingAddressPostcode" />
        <div className="FormExplanation">Validity relating to prescence of other address fields</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Favourite Color</div>
        <Input
          className="FormTextInput"
          fieldName="favouriteColor"
          type="text"
        />
        <FieldErrorRight fieldName="favouriteColor" />
        <div className="FormExplanation">Validates when populated but not required</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Tweet ({tweetRemainingChars})</div>
        <TextArea
          className="FormTextArea"
          fieldName="tweet"
          type="text"
        />
        <FieldErrorRight fieldName="tweet" />
        <div className="FormExplanation">TextArea with label containing manipulated value</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Gender*</div>
        <div>
          <Input
            className="FormRadioButton"
            fieldName="gender"
            id="genderFemale"
            type="radio"
            name="gender"
            value={genders.FEMALE}
          />
          <label htmlFor="genderFemale">Female</label>
        </div>

        <div>
          <Input
            className="FormRadioButton"
            fieldName="gender"
            id="genderMale"
            type="radio"
            name="gender"
            value={genders.MALE}
          />
          <label htmlFor="genderMale">Male</label>
        </div>
        <FieldErrorRight fieldName="gender" />
        <div className="FormExplanation">Radio buttons</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Terms and conditions*</div>
        <Input
          className="FormCheckbox"
          fieldName="agreeTermsAndConditions"
          id="agreeTermsAndConditions"
          type="checkbox"
        />
        <label htmlFor="agreeTermsAndConditions">I agree to something</label>
        <FieldErrorRight fieldName="agreeTermsAndConditions" />
        <div className="FormExplanation">Checkbox with conditional validation</div>
      </div>

      <div className="FormField">
        <div className="FormLabel">Language*</div>
        <Select className="FormSelect" fieldName="language">
          {
            languagesWithCTA.map(language =>
              <option key={language.id} value={language.id}>{language.name}</option>)
          }
        </Select>
        <FieldErrorRight fieldName="language" />
        <div className="FormExplanation">Select with enforced selection</div>
      </div>

      <div>
        <SubmitButton
          className="FormSubmitButton"
          style={{ display: 'inline-block' }}
          tag="a"
          href="#"
          onClick={event => {
            event.preventDefault();
            console.log('Submit!');
          }}
        >Submit</SubmitButton>
        <div className="FormExplanation">
          Submit button becomes clickable when the whole form is valid
        </div>
      </div>

      */}
      {/*
        <Visualizer style={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        />
      */}
  </div>
)
};

SignupForm.propTypes = {
  form: React.PropTypes.object,
};

export default initialize(signupFormConfig)(SignupForm);
