import React from 'react';
import {
  initialize,
  Input,
  Select,
  SubmitButton,
  TextArea,
} from 'react-formic';
import connectError from 'react-formic/lib/components/connectors/connectError';

import signUpFormConfig, { genders, languages } from './signUpFormConfig';

import './SignupForm.css';
import '../../../styles/form.css';

// --------------------------------------------------
// Error labels

const FieldErrorRightContent = ({ field: { validityMessage } }) => (
  <span className="Form_ErrorRight">{validityMessage}</span>
);

FieldErrorRightContent.propTypes = {
  field: React.PropTypes.object,
};

const FieldErrorRight = connectError()(FieldErrorRightContent);

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
  const tweetValue = form.getIn(['fields', 'tweet', 'value']);
  const tweetRemainingChars = tweetValue ? TWEET_LENGTH - tweetValue.length : TWEET_LENGTH;
  return (
    <div className="SignupForm">
      <h1 className="SignupForm-Title">SignupForm</h1>
        <div className="Form_Field">
          <div className="Form_Label">Email*</div>
          <Input
            className="Form_TextInput"
            fieldName="email"
            type="text"
          />
          <FieldErrorRight fieldName="email" />
          <div className="Form_FieldExplanation">
            Debounced validation
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">UserName*</div>
          <Input
            className="Form_TextInput"
            fieldName="userName"
            type="text"
          />
          <FieldErrorRight fieldName="userName" />
          <div className="Form_FieldExplanation">
            Remote api check for uniquness
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Credit Card Number*</div>
          <Input
            className="Form_TextInput"
            fieldName="creditCardLongNumber"
            type="text"
          />
          <FieldErrorRight fieldName="creditCardLongNumber" />
          <div className="Form_FieldExplanation">
            Value restriction and transformation
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Billing address line 1</div>
          <Input
            className="Form_TextInput"
            fieldName="billingAddressLine1"
            type="text"
          />
          <FieldErrorRight fieldName="billingAddressLine1" />
          <div className="Form_FieldExplanation">
            Validity relating to prescence of other address fields
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Billing address line 2</div>
          <Input
            className="Form_TextInput"
            fieldName="billingAddressLine2"
            type="text"
          />
          <FieldErrorRight fieldName="billingAddressLine2" />
          <div className="Form_FieldExplanation">
            Validity relating to prescence of other address fields
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Billing address postcode</div>
          <Input
            className="Form_TextInput"
            fieldName="billingAddressPostcode"
            type="text"
          />
          <FieldErrorRight fieldName="billingAddressPostcode" />
          <div className="Form_FieldExplanation">
            Validity relating to prescence of other address fields
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Favourite Color</div>
          <Input
            className="Form_TextInput"
            fieldName="favouriteColor"
            type="text"
          />
          <FieldErrorRight fieldName="favouriteColor" />
          <div className="Form_FieldExplanation">
            Validates when populated but not required
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Tweet ({tweetRemainingChars})</div>
          <TextArea
            className="Form_TextArea"
            fieldName="tweet"
            type="text"
          />
          <FieldErrorRight fieldName="tweet" />
          <div className="Form_FieldExplanation">
            TextArea with label containing manipulated value
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Gender*</div>
          <div>
            <Input
              className="Form_RadioButton"
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
              className="Form_RadioButton"
              fieldName="gender"
              id="genderMale"
              type="radio"
              name="gender"
              value={genders.MALE}
            />
            <label htmlFor="genderMale">Male</label>
          </div>
          <FieldErrorRight fieldName="gender" />
          <div className="Form_FieldExplanation">
            Radio buttons
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Terms and conditions*</div>
          <Input
            className="Form_Checkbox"
            fieldName="agreeTermsAndConditions"
            id="agreeTermsAndConditions"
            type="checkbox"
          />
          <label className="Form_CheckboxLabel" htmlFor="agreeTermsAndConditions">
            I agree to something
          </label>
          <FieldErrorRight fieldName="agreeTermsAndConditions" />
          <div className="Form_FieldExplanation">
            Checkbox with conditional validation
          </div>
        </div>

        <div className="Form_Field">
          <div className="Form_Label">Language*</div>
          <Select className="Form_Select" fieldName="language">
            {
              languagesWithCTA.map(language =>
                <option key={language.id} value={language.id}>{language.name}</option>)
            }
          </Select>
          <FieldErrorRight fieldName="language" />
          <div className="Form_FieldExplanation">
            Select with enforced selection
          </div>
        </div>

        <div>
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
          <div className="Form_FieldExplanation">
            Submit button becomes clickable when the whole form is valid
          </div>
        </div>
    </div>
  );
};

SignupForm.propTypes = {
  form: React.PropTypes.object,
};

export default initialize(signUpFormConfig)(SignupForm);
