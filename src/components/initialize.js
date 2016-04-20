import React from 'react';
import { Map } from 'immutable';
import { Subject } from 'rx';

import { INVALID } from '../constants/validationStates';
import { mapObjectToObject } from 'formalizer/lib/utils/objectUtils';
import {
  Field,
  Form,
} from 'formalizer/lib/data/stateTypes';

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
            field: Map(cleanValidationOutput(value)),
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
      setFormField({ fieldName: fieldNameToTrigger, field: Map({ isDirty: true }) });
    }

    // Trigger the field to revalidate with its current value
    fieldValidators[fieldNameToTrigger].subject.onNext(fieldToTrigger.value);
  });
}

function createFieldChangeHandlers(
  configFields, triggerFieldMap, fieldValidators, getFormState, setFormField
) {
  return mapObjectToObject(configFields, (field, fieldName) => value => {
    setFormField({
      fieldName,
      field: Map({
        isDirty: true,
        value: field.transform ? field.transform(value) : value,
      }),
    });

    triggerRelatedFields(triggerFieldMap[fieldName], fieldValidators, getFormState, setFormField);
  });
}

function createEmptyForm(fields) {
  return new Form({
    fields: Map(mapObjectToObject(fields, field => new Field({
      value: field.initialValues ? field.initialValues.value : undefined,
    }))),
  });
}



function getFieldsWithDiff(formState1, formState2) {
  return formState2.fields.reduce((acc, field, fieldName) => {
    return !formState1 || field !== formState1.fields.get(fieldName)
      ? acc.set(fieldName, field)
      : acc;
  }, Map({}));
}

function defaultMapFormToProps(formState) {
  return { form: formState };
}

function initialize(config, mapFormToProps = defaultMapFormToProps) {
  return ComponentToWrap => {
    class WrapperComponent extends React.Component {

      static propTypes = {
        deleteForm: React.PropTypes.func.isRequired,
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
          getFormState: this.getFormalizerForm,
        };
      }

      componentWillMount() {
        const { formState, setFormField, initializeForm } = this.props;
        const { fields, name } = config;

        this.triggerFieldMap = createTriggerFieldMap(fields);
        this.fieldValidators = createFieldValidators(fields, this.getFormState, setFormField);
        this.fieldChangeHandlers = createFieldChangeHandlers(
          fields, this.triggerFieldMap, this.fieldValidators, this.getFormState, setFormField
        );

        // Only create an empty for state if one doesn't already exist. State can persist after a
        // form unmounts if the reduxPersistenceWrapper is being used.
        if (!formState) {
          initializeForm({ form: createEmptyForm(fields), formName: name });
        }
      }

      componentWillReceiveProps(nextProps) {
        getFieldsWithDiff(this.props.formState, nextProps.formState)
        .forEach((field, fieldName) => this.fieldValidators[fieldName].subject.onNext(field.value));
      }

      componentWillUnmount() {
        if (this.props.onUnmount) {
          this.props.onUnmount();
        }
      }

      getFormFieldState = fieldName => this.props.formState.getIn(['fields', fieldName])

      getFormFieldChangeHandler = fieldName => this.fieldChangeHandlers[fieldName]

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

