import React from 'react';
import { FuncSubject } from 'rx-react';
import Rx from 'rx';

import { mapObjectToArray, mapObjectToObject } from '../utils/objectUtils';
import { INVALID } from '../constants/validationStates';
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

const createFormStream = (config, valueStreams, getFormalizerForm) =>
  // mergeValueStreams(valueStreams)
  // .do((value) => {
  //   console.log('value change', value);
  // })
  // .map(fields => ({ fields }))
  // .merge(config.createValidationStream(valueStreams, getFormalizerForm))
  // .scan((acc, stream) => mergeNewStreamContent(acc, stream));
  // TODO: Check if startWith is necessary in both Redux and local state persistence wrappers
  // and write note either way
  // .startWith(INITIAL_FORM_STATE);

  config.createValidationStream(valueStreams, getFormalizerForm);

const getFinalValueStreams = (rawValueStreams, mappedValueStreams) =>
  mapObjectToObject(
    rawValueStreams,
    (rawValueStream, key) => (mappedValueStreams[key] || rawValueStream)
  );
  // rawValueStreams.map((rawValueStream, key) => mappedValueStreams[key] || rawValueStream);

export const INITIAL_FORM_STATE = { fields: {}, validity: INVALID };

export function formalize(config) {
  const rawValueStreams = config.fields.reduce((acc, fieldName) => ({
    ...acc,
    [fieldName]: FuncSubject.create(),
  }), {});

  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        initializeForm: React.PropTypes.func.isRequired,
        setFormFieldValue: React.PropTypes.func.isRequired,
        // TODO Rename to getFormalizerFormState
        setFormalizerState: React.PropTypes.func.isRequired,
        getFormalizerState: React.PropTypes.func.isRequired,

      };

      static childContextTypes = {
        getFormalizerField: React.PropTypes.func,
        getFormalizerForm: React.PropTypes.func,
      }

      getChildContext() {
        return {
          getFormalizerField: this.getFormalizerField,
          getFormalizerForm: this.getFormalizerForm,
        };
      }

      componentWillMount() {
        // TODO Find a nicer, more universal way of doing this
        this.props.initializeForm();

        // const tempEmailStream = getFinalValueStreams(rawValueStreams, config.transformValueStreams(rawValueStreams)).email;
        // tempEmailStream.subscribe(
        //   value => {
        //     console.log('value: ', value);
        //   }
        // );


        // TODO Listen to all value streams and dispatch field value change action

        const valueStreams = getFinalValueStreams(rawValueStreams, config.transformValueStreams(rawValueStreams));

        this.disposableValueStreams = mapObjectToArray(valueStreams, (valueStream, fieldName) => {

          return valueStream.subscribe(
            value => {
              console.log('trigger update field value action: ', fieldName, value);
              this.props.setFormFieldValue({ fieldName, value });

            },
          );
        });


        this.form$ = createFormStream(
          config,
          valueStreams,
          this.getFormalizerForm
        )
        .subscribe(formState => this.props.setFormalizerState(formState));
      }

      componentWillUnmount() {
        this.form$.dispose();
        this.disposableValueStreams.forEach(stream => stream.dispose());
      }

      getFormalizerField = fieldName => ({
        ...this.props.getFormalizerState().fields[fieldName],
        onChange: rawValueStreams[fieldName],
      })

      getFormalizerForm = includeOnChangeHandlers => {
        const formState = this.props.getFormalizerState();
        return includeOnChangeHandlers
        ? {
          ...formState,
          fields: mapObjectToObject(rawValueStreams, (valueStream, fieldName) => ({
            ...formState.fields[fieldName],
            onChange: valueStream,
          })),
        }
        : formState;
      }

      render() {
        return <ComponentToWrap />;
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
