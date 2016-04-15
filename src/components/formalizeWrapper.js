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

export function formalize(config) {
  const streams = config.fields.reduce((acc, fieldName) => {
    return {
      ...acc,
      [fieldName]: FuncSubject.create(),
    };
  }, {});


  console.log('streams: ', streams);

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
        const validation$ = config.createValidationStream(streams);

        this.disposeStream = streams.email.map(value => ({ email: value }))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        .map(fieldValues => ({ fieldValues }))
        .merge(validation$.map(validation => ({ validation })))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        .startWith({ fieldValues: {} })
        .subscribe(
          formState => {
            this.setFormalizerState(formState);
          }
        );
      }

      componentWillUnmount() {
        this.disposeStream();
      }

      setFormalizerState(formState) {
        this.setState({ formalizer: formState });
      }

      getFormalizerState() {
        return this.state.formalizer;
      }

      getFormalizerField = (fieldName) => {
        const formState = this.getFormalizerState();
        return {
          ...(formState.validation ? formState.validation.fields[fieldName] : undefined),
          value: formState.fieldValues[fieldName],
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
            <ComponentToWrap />
          </div>
        );
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
