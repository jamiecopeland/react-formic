import React from 'react';
import { FuncSubject } from 'rx-react';
import Rx from 'rx';
// import { merge } from 'ramda';
import {merge} from 'lodash';

import { mapObjectToArray, mapObjectToObject } from '../utils/objectUtils';

const mapValueToProperty = propertyName => value => ({ [propertyName]: value });
const mergeValueStreams = streams => Rx.Observable
  .merge(null, mapObjectToArray(streams, (value, key) => value.map(mapValueToProperty(key))))
  .scan((acc, x) => ({ ...acc, ...x }));

/**
 * Merges multiple value streams that output this shape data:
 * {
 *   email: 'darth@deathstar.com',
 * }
 *
 * Into a single stream that outputs this shape data:
 * {
 *   email: {
 *     value: 'darth@deathstar.com',
 *   }
 *   userName: {
 *     value: 'darth1',
 *   }
 * }
 */
const mergeValueStreams2 = streams => Rx.Observable
  .merge(null, mapObjectToArray(streams, (stream, key) => stream.map(value => ({
    [key]: {
      value,
    },
  }))))
  .scan((acc, x) => ({ ...acc, ...x }));

export const INITIAL_FORM_STATE = {
  fieldValues: {},
  validation: { fields: {} },
};

export function formalize(config) {
  const valueStreams = config.fields.reduce((acc, fieldName) => ({
    ...acc,
    [fieldName]: FuncSubject.create(),
  }), {});

  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        setFormalizerState: React.PropTypes.func,
        getFormalizerState: React.PropTypes.func,
        initializeForm: React.PropTypes.func,
      };

      static childContextTypes = {
        getFormalizerField: React.PropTypes.func,
      }

      getChildContext() {
        return {
          getFormalizerField: this.getFormalizerField,
        };
      }

      componentWillMount() {
        // TODO Find a nicer, more universal way of doing this
        this.props.initializeForm();

        this.validation$ = mergeValueStreams(valueStreams)
        .map(fieldValues => ({ fieldValues }))
        .merge(config.createValidationStream(valueStreams).map(validation => ({ validation })))
        .scan((acc, stream) => ({ ...acc, ...stream }))
        // Ensure validation is always populated with an empty object to prevent a conditional
        // being needed in getFormalizerField which is called very frequently by inputs via context.
        .map(formState => ({
          ...formState,
          validation: formState.validation || INITIAL_FORM_STATE.validation,
        }))
        .subscribe(formState => this.props.setFormalizerState(formState));

        // Nicer output
        this.validation2$ = mergeValueStreams2(valueStreams)
        .map(fields => ({ fields }))
        .merge(config.createValidationStream(valueStreams))
        .scan((acc, stream) => {
          return merge({}, acc, stream);
        })
        .subscribe(formState => console.log('final: ', JSON.stringify(formState)));
      }

      componentWillUnmount() {
        this.validation$.dispose();
      }

      getFormalizerField = (fieldName) => {
        const formState = this.props.getFormalizerState();
        return {
          ...formState.validation.fields[fieldName],
          value: formState.fieldValues[fieldName],
          // validation: formState.validation.fields[fieldName],
          onChange: valueStreams[fieldName],
        };
      }

      getFormalizerField = (fieldName) => {
        const formState = this.props.getFormalizerState();
        return {
          ...formState.validation.fields[fieldName],
          value: formState.fieldValues[fieldName],
          // validation: formState.validation.fields[fieldName],
          onChange: valueStreams[fieldName],
        };
      }

      render() {
        return <ComponentToWrap />;
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
