import React, { Component } from 'react';

import { INITIAL_FORM_STATE } from '../components/formalizeWrapper';

export const wrap = FormComponent => {
  class LocalStatePersistenceWrapper extends Component {

    constructor(props) {
      super(props);
      this.state = INITIAL_FORM_STATE;
    }

    getFormalizerState = () => this.state

    setFormalizerState = state => this.setState(state)

    render() {
      return (
        <FormComponent
          {...this.props}
          getFormalizerState={this.getFormalizerState}
          setFormalizerState={this.setFormalizerState}
        />
      );
    }
  }

  return LocalStatePersistenceWrapper;
};
