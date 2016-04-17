import React from 'react';
import { FuncSubject } from 'rx-react';
import Rx from 'rx';
import { merge } from 'lodash';
import { mapObjectToArray } from '../utils/objectUtils';

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

export const INITIAL_FORM_STATE = { fields: {} };

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

        // TODO: Check if startWith is necessary in both Redux and local state persistence wrappers and write note either way
        this.validation2$ = mergeValueStreams2(valueStreams)
        .map(fields => ({ fields }))
        .merge(config.createValidationStream(valueStreams))
        .scan((acc, stream) => merge({}, acc, stream))
        .startWith(INITIAL_FORM_STATE)
        .subscribe(formState => this.props.setFormalizerState(formState));
      }

      componentWillUnmount() {
        this.validation$.dispose();
      }

      getFormalizerField = (fieldName) => {
        const formState = this.props.getFormalizerState();
        return {
          ...formState.fields[fieldName],
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
