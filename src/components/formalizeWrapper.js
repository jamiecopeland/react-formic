import React from 'react';
import { FuncSubject } from 'rx-react';
import { curry } from 'ramda';
import { set } from 'lodash';
import Rx from 'rx';

import { VALID, INVALID } from '../constants/validationStates';
import { mapObjectToObject, mapObjectToArray } from '../utils/objectUtils';

function upsert(list, createItem, key) {
  let item = list[key];
  if (!item) {
    item = list[key] = FuncSubject.create();
  }
  return item;
}

const mapValueToProperty = propertyName => value => ({ [propertyName]: value });
const mergeValueStreams = streams => Rx.Observable
  .merge(null, mapObjectToArray(streams, (value, key) => value.map(mapValueToProperty(key))))
  .scan((acc, x) => ({ ...acc, ...x }));

export function formalize(config) {
  const valueStreams = config.fields.reduce((acc, fieldName) => ({
    ...acc,
    [fieldName]: FuncSubject.create(),
  }), {});

  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        setFormFieldValue: React.PropTypes.func,
        getFormFieldValue: React.PropTypes.func,
      };

      static childContextTypes = {
        getFormalizerField: React.PropTypes.func,
      }

      constructor(props) {
        super(props);
        this.state = {};
      }

      getChildContext() {
        return {
          getFormalizerField: this.getFormalizerField,
        };
      }

      componentWillMount() {
        const validation$ = config.createValidationStream(valueStreams);

        this.disposeStream = mergeValueStreams(valueStreams)
        .map(fieldValues => ({ fieldValues }))
        .merge(validation$.map(validation => ({ validation })))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        .startWith({ fieldValues: {} })
        .subscribe(formState => this.setFormalizerState(formState));
      }

      componentWillUnmount() {
        // if (this.disposeStream) this.disposeStream();
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
          onChange: valueStreams[fieldName],
        };
      }

      getFormalizerErrorlabel = (labelName) => {
        return config.errorLabelMap[labelName];
      }

      render() {
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
