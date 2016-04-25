import React, { Component } from 'react';

export const connectLocalState = FormComponent => {
  class LocalStatePersistenceWrapper extends Component {

    constructor(props) {
      super(props);
      this.actionQueue = [];
      this.state = {};
    }

    initializeForm = ({ form }) => this.setState({ form }) // eslint-disable-line

    setFormField = ({ field, fieldName, shouldReplace }) => {
      console.log('setFormField: ', fieldName, field);
      this.actionQueue.push({ field, fieldName, shouldReplace });
      this.invalidateState();
    }

    invalidateState() {
      requestAnimationFrame(this.executeStateChanges);
    }

    executeStateChanges = () => {
      if (this.actionQueue.length > 0) {
        const newForm = this.actionQueue.reduce((acc, { field, fieldName, shouldReplace }) =>
          shouldReplace
            ? acc.setIn(['fields', fieldName], field)
            : acc.setIn(['fields', fieldName], acc.getIn(['fields', fieldName]).merge(field)),
          this.state.form
        );

        this.actionQueue = [];
        this.setState({ form: newForm });
      }
    }

    getFormState = () => this.state.form;

    render() {
      return (
        <FormComponent
          {...this.props}
          formState={this.getFormState()}
          initializeForm={this.initializeForm}
          setFormField={this.setFormField}
        />
      );
    }
  }

  return LocalStatePersistenceWrapper;
};
