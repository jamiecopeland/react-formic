import React from 'react';
import { Map } from 'immutable';
import { Subject } from 'rx';

import { INVALID } from '../constants/validity';
import { mapObjectToObject, forEachPropertyOfObject } from '../utils/objectUtils';
import {
  Field,
  Form,
} from '../data/stateTypes';

function cleanValidationOutput({ validity, validityMessage }) {
  return {
    validity,
    validityMessage: validity === INVALID ? validityMessage : null,
  };
}

function createTriggerFieldMap(fields) {
  return Object.keys(fields)
    .filter(fieldName => fields[fieldName].triggerFields)
    .reduce((acc, fieldName) => {
      fields[fieldName].triggerFields.forEach(triggerFieldName => {
        acc[triggerFieldName].push(fieldName);
      });
      return acc;
    }, mapObjectToObject(fields, () => []));
}

function createFieldValidationChangeHandlers(configFields, getFormState) {
  return mapObjectToObject(configFields, field => {
    // let output;

    // if (field.validationStream) {
    //   const subject = new Subject();
    //   const validationStream = field.validationStream(subject, getFormState);
    //   output = {
    //     validationStream,
    //     onChange: value => subject.onNext(value),
    //   };
    // } else {
    //   output = null;
    // }


    const subject = new Subject();
    // const validationStream = field.validationStream(subject, getFormState);
    const output = {
      validationStream: field.validationStream
        ? field.validationStream(subject, getFormState)
        : null,
      onChange: value => subject.onNext(value),
    };


    return output;
  });
}

function createFieldValueChangeHandlers(fields) {
  return mapObjectToObject(fields, field => {
    const subject = new Subject();
    return {
      valueStream: field.valueStream
        ? field.valueStream(subject)
        : subject,
      onChange: value => subject.onNext(value),
    };
  });
}

function triggerRelatedFields(
  relatedFields, fieldValidationChangeHandlers, formState, setFormField
) {
  // Trigger other fields that need to know when this one changes
  relatedFields.forEach(fieldNameToTrigger => {
    // Set the field to dirty if it isn't already
    const fieldToTrigger = formState.getIn(['fields', fieldNameToTrigger]);
    if (!fieldNameToTrigger.isDirty) {
      setFormField({ fieldName: fieldNameToTrigger, field: { isDirty: true } });
    }

    // Trigger the field to revalidate with its current value
    fieldValidationChangeHandlers[fieldNameToTrigger].onChange(fieldToTrigger.value);
  });
}

function createEmptyForm(fields) {
  return new Form({ fields: Map(mapObjectToObject(fields, () => Field())) });
}

function getFieldsWithValueDiff(formState1, formState2) {
  return formState2.fields.reduce((acc, field, fieldName) =>
    !formState1 || field.value !== formState1.fields.get(fieldName).value
      ? acc.set(fieldName, field)
      : acc
  , Map({}));
}

// --------------------------------------------------

function defaultMapFormToProps(formState) {
  return { form: formState };
}

function initialize(config, mapFormToProps = defaultMapFormToProps) {
  return ComponentToWrap => {
    class WrapperComponent extends React.Component {

      static propTypes = {
        formState: React.PropTypes.object,
        initializeForm: React.PropTypes.func.isRequired,
        onUnmount: React.PropTypes.func,
        setFormField: React.PropTypes.func.isRequired,
      };

      static childContextTypes = {
        getFormFieldState: React.PropTypes.func,
        getFormFieldChangeHandler: React.PropTypes.func,
        getFormState: React.PropTypes.func,
      }

      getChildContext() {
        return {
          getFormFieldState: this.getFormFieldState,
          getFormFieldChangeHandler: this.getFormFieldChangeHandler,
          getFormState: this.getFormState,
        };
      }

      componentWillMount() {
        const { formState, setFormField, initializeForm } = this.props;
        const { fields, name } = config;

        this.fieldValueChangeHandlers = createFieldValueChangeHandlers(fields);
        this.fieldValidationChangeHandlers = createFieldValidationChangeHandlers(
          fields, this.getFormState
        );
        this.triggerFieldMap = createTriggerFieldMap(fields);

        // Only create an empty formState if one doesn't already exist. State can persist after a
        // form unmounts if the reduxStateWrapper is being used.
        if (!formState) {
          initializeForm({ form: createEmptyForm(fields), formName: name });
        }

        // Create and register streams
        this.streams = [];

        // Set isRequired values on fields
        forEachPropertyOfObject(config.fields, ({ isRequired }, fieldName) => {
          setFormField({
            field: { isRequired },
            fieldName,
          });
        });

        forEachPropertyOfObject(this.fieldValueChangeHandlers, ({ valueStream }, fieldName) => {
          this.registerStream(
            valueStream.subscribe(value => setFormField({
              field: { value, isDirty: true },
              fieldName,
            }))
          );
        });

        forEachPropertyOfObject(this.fieldValidationChangeHandlers, (validationChangeHandler, fieldName) => { // eslint-disable-line
          // console.log('validationChangeHandler: ', validationChangeHandler);
          if (validationChangeHandler.validationStream) {
            this.registerStream(
              validationChangeHandler.validationStream.subscribe(
                value => setFormField({
                  field: cleanValidationOutput(value),
                  fieldName,
                })
              )
            );
          }
        });


      }

      componentWillReceiveProps(nextProps) {
        // TODO Move this out into utility function
        getFieldsWithValueDiff(this.props.formState, nextProps.formState)
        .filter(field => field.isDirty)
        .forEach(({ value }, fieldName) => {
          this.fieldValidationChangeHandlers[fieldName].onChange(value);

          triggerRelatedFields(
            this.triggerFieldMap[fieldName],
            this.fieldValidationChangeHandlers,
            nextProps.formState,
            this.props.setFormField
          );
        });
      }

      componentWillUnmount() {
        if (this.props.onUnmount) {
          this.props.onUnmount();
        }
        this.disposeStreams();
      }

      getFormFieldState = fieldName => this.props.formState.getIn(['fields', fieldName])

      getFormFieldChangeHandler = fieldName => this.fieldValueChangeHandlers[fieldName].onChange

      getFormState = () => this.props.formState

      registerStream(stream) {
        this.streams.push(stream);
      }

      disposeStreams() {
        this.streams.forEach(stream => stream.dispose());
      }

      render() {
        const { formState } = this.props;

        // The first render happens before initialization has time to complete so only render
        // contents afterwards to avoid lots of conditional checking for state in sub components
        return formState
          ? <ComponentToWrap {...mapFormToProps(formState)} />
          : null;
      }
    }

    return config.stateWrapper(WrapperComponent);
  };
}

export default initialize;
