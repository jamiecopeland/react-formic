import React from 'react';
import { FuncSubject } from 'rx-react';
import { curry } from 'ramda';
import { set } from 'lodash';

import { VALID, INVALID } from '../constants/validationStates';
import { mapObjectToObject, mapObjectToArray } from '../utils/objectUtils';

function upsert(list, createItem, key) {
  let item = list[key];
  if (!item) {
    item = list[key] = FuncSubject.create();
  }
  return item;
}

function createEmptyValidationObject(fieldNames) {
  return {
    // fields: fieldNames.reduce(fieldName => ({})),
    fields: {
      email: {}
    },
    validiity: INVALID,
  };
}

export function formalize(config) {
  const streams = {};

  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        setFormFieldValue: React.PropTypes.func,
        getFormFieldValue: React.PropTypes.func,
      };

      static childContextTypes = {
        getFormalizerField: React.PropTypes.func,
        getFormalizerErrorLabel: React.PropTypes.func,
      }

      constructor(props) {
        super(props);
        this.state = {};
      }

      getChildContext() {
        return {
          getFormalizerField: this.getFormalizerField,
          getFormalizerErrorLabel: this.getFormalizerErrorlabel,
        };
      }

      componentWillMount() {
        const getValueStream = curry(upsert)(streams, () => FuncSubject.create);
        const validation$ = config.createValidationStream(getValueStream);

        this.disposeStream = streams.email.map(value => ({ email: value }))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        .map(fieldValues => ({ fieldValues }))
        .merge(validation$.map(validation => ({ validation })))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        .subscribe(
          value => {
            this.setState(value);
          }
        );

        // TODO Switch state setting over to being abstracted throught setFormFieldValue or
        // something similar
        // const { setFormFieldValue } = this.props;

        // Create empty container objects
        this.setState({
          fieldValues: {},
          validation: createEmptyValidationObject(Object.keys(streams)),
        });
      }

      componentWillUpdate(nextProps) {
        // this.repopulateFormalizerObject(nextProps);
      }

      componentWillUnmount() {
        this.disposeStream();
      }

      // setFormalizerState(formState) {
      //   this.setState()
      // }

      // getFormalizerState(formState) {
      //   return this.state.formalizer;
      // }

      getFormalizerField = (fieldName) => {
        return {
          ...this.state.validation.fields[fieldName],
          value: this.state.fieldValues[fieldName],
          onChange: streams[fieldName],
        };
      }

      getFormalizerErrorlabel = (labelName) => {
        return config.errorLabelMap[labelName];
      }

      render() {
        console.log('render: ', this.state);
        return (
          <div>
            <ComponentToWrap formalizer={this.state.validation} />
          </div>
        );
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
