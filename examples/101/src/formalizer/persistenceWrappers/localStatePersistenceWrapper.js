import React, { Component } from 'react';

export const wrap = FormComponent => {
  class LocalStatePersistenceWrapper extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    getFormFieldValue = (fieldName, propertyName) => {
      const field = this.state[fieldName];
      return field ? field[propertyName] : undefined;
    }

    setFormFieldValue = (fieldName, propertyName, value) => {
      const field = this.state[fieldName] || {};

      this.setState({
        [fieldName]: {
          ...field,
          [propertyName]: value,
        },
      });
    }

    render() {
      return (
        <FormComponent
          {...this.props}
          getFormFieldValue={this.getFormFieldValue}
          setFormFieldValue={this.setFormFieldValue}
        />
      );
    }
  }

  return LocalStatePersistenceWrapper;
};
