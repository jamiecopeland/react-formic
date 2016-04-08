import React from 'react';

import SignupForm from 'client/components/elements/signupForm/SignupForm';

import 'styles/global.css';
import 'styles/formalizer.css';
import './Root.css';

export default class Root extends React.Component { // eslint-disable-line

  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <div className="Root">
        <SignupForm />
        {this.props.children}
      </div>
    );
  }

}
