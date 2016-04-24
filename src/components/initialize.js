import React from 'react';
import { Map } from 'immutable';
import { Observable, Subject } from 'rx';

import { INVALID } from '../constants/validity';
import { mapObjectToObject } from '../utils/objectUtils';
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

function createFieldValidators(configFields, getFormState, setFormField) {
  return mapObjectToObject(configFields, (field, fieldName) => {
    let output;

    if (field.validate) {
      const subject = new Subject();
      const stream = field.validate(subject, getFormState).subscribe(
        value => {
          // console.log('validation', value);
          setFormField({
            field: cleanValidationOutput(value),
            fieldName,
          });
        }
      );
      output = { stream, subject };
    } else {
      output = null;
    }

    return output;
  });
}

function triggerRelatedFields(relatedFields, fieldValidators, getFormState, setFormField) {
  // Trigger other fields that need to know when this one changes
  relatedFields.forEach(fieldNameToTrigger => {
    // Set the field to dirty if it isn't already
    const fieldToTrigger = getFormState().getIn(['fields', fieldNameToTrigger]);
    if (!fieldNameToTrigger.isDirty) {
      setFormField({ fieldName: fieldNameToTrigger, field: { isDirty: true } });
    }

    // Trigger the field to revalidate with its current value
    fieldValidators[fieldNameToTrigger].subject.onNext(fieldToTrigger.value);
  });
}

function createFieldChangeHandlers(fields) {
  return mapObjectToObject(fields, () => {
    const subject = new Subject();
    return {
      valueStream: subject,
      onChange: value => subject.onNext(value),
    };
  });
}

function createEmptyForm(fields) {
  return new Form({
    fields: Map(mapObjectToObject(fields, ({ initialValues }) => Field(
      initialValues
      ? {
        value: initialValues.value,
        isRequired: initialValues.isRequired,
      }
      : {}
    ))),
  });
}

function createValueStream(fields, changeHandlers) {
  const formValueStream = Object.keys(fields).reduce((acc, fieldName) => {
    const { transformStream } = fields[fieldName];
    const { valueStream } = changeHandlers[fieldName];
    return acc.merge(
      (
        transformStream
        ? transformStream(valueStream)
        : valueStream
      )
      .map(value => ({ [fieldName]: { value } })));
  }, Observable.create(() => {}));
  return formValueStream
    .scan((acc, stream) => ({ ...acc, ...stream }));
}

function getFieldsWithDiff(formState1, formState2) {
  return formState2.fields.reduce((acc, field, fieldName) =>
    !formState1 || field !== formState1.fields.get(fieldName)
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
        setFormFields: React.PropTypes.func.isRequired,
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

        this.triggerFieldMap = createTriggerFieldMap(fields);
        this.fieldValidators = createFieldValidators(fields, this.getFormState, setFormField);
        this.fieldChangeHandlers = createFieldChangeHandlers(fields);

        // Only create an empty formState if one doesn't already exist. State can persist after a
        // form unmounts if the reduxPersistenceWrapper is being used.
        if (!formState) {
          initializeForm({ form: createEmptyForm(fields), formName: name });
        }

        createValueStream(fields, this.fieldChangeHandlers)
        .subscribe(newFields => this.props.setFormFields({ fields: newFields }));
      }

      componentWillReceiveProps(nextProps) {
        getFieldsWithDiff(this.props.formState, nextProps.formState)
        .forEach((field, fieldName) => {
          this.fieldValidators[fieldName].subject.onNext(field.value);
          // console.log('triggering stream: ', fieldName, field.value);
          // TODO trigger related fields
        });
      }

      componentWillUnmount() {
        if (this.props.onUnmount) {
          this.props.onUnmount();
        }
      }

      getFormFieldState = fieldName => this.props.formState.getIn(['fields', fieldName])

      getFormFieldChangeHandler = fieldName => this.fieldChangeHandlers[fieldName].onChange

      getFormState = () => this.props.formState

      render() {
        const { formState } = this.props;

        // The first render happens before initialization has time to complete so only render
        // contents afterwards to avoid lots of conditional checking for state in sub components
        return formState
          ? <ComponentToWrap {...mapFormToProps(formState)} />
          : null;
      }
    }

    return config.persistenceWrapper(WrapperComponent);
  };
}

export default initialize;
