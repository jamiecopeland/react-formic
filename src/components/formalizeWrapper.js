import React from 'react';
import { FuncSubject } from 'rx-react';
import Rx from 'rx';
import { mapObjectToArray, mapObjectToObject } from '../utils/objectUtils';

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
const mergeValueStreams = streams => Rx.Observable
  .merge(null, mapObjectToArray(streams, (stream, key) => stream.map(value => ({
    [key]: { value },
  }))))
  .scan((acc, x) => ({ ...acc, ...x }));

const mergeNewStreamContent = (currentContent, newContent) => ({
  ...currentContent,
  ...newContent,
  fields: mapObjectToObject(newContent.fields, (field, fieldName) => ({
    ...currentContent.fields[fieldName],
    ...field,
  })),
});

const createFormStream = (config, valueStreams) => mergeValueStreams(valueStreams)
  .map(fields => ({ fields }))
  .merge(config.createValidationStream(valueStreams))
  .scan((acc, stream) => mergeNewStreamContent(acc, stream));
  // TODO: Check if startWith is necessary in both Redux and local state persistence wrappers
  // and write note either way
  // .startWith(INITIAL_FORM_STATE);

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

        this.form$ = createFormStream(config, valueStreams)
        .subscribe(formState => this.props.setFormalizerState(formState));
      }

      componentWillUnmount() {
        this.form$.dispose();
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
