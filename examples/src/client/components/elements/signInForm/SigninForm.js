import React from 'react';

const SignInForm = () => {
  return (
    <div>
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
    </div>
  );
};

export default SignInForm;
