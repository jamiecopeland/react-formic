import React from 'react';
import { Map } from 'immutable';
import { Subject } from 'rx';

import { INVALID } from '../constants/validationStates';
import { mapObjectToObject } from 'formalizer/lib/utils/objectUtils';
import { logImmutable } from '../utils/immutableUtils';

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

export function formalize(config, mapFormToProps) {
  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        deleteForm: React.PropTypes.func.isRequired,
        formState: React.PropTypes.object,
        initializeForm: React.PropTypes.func.isRequired,
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
        this.triggerFieldMap = Object.keys(config.fields)
        .filter(fieldName => config.fields[fieldName].triggerFields)
        .reduce((acc, fieldName) => {
          config.fields[fieldName].triggerFields.forEach(triggerFieldName => {
            acc[triggerFieldName].push(fieldName);
          });
          return acc;
        }, mapObjectToObject(config.fields, () => []));

        // Create validation streams
        this.fieldValidators = mapObjectToObject(config.fields, (field, fieldName) => {
          let output;

          if (field.validate) {
            const subject = new Subject();
            const stream = field.validate(subject, this.getFormState).subscribe(
              value => {
                // console.log('validation', value);
                this.props.setFormField({
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

        // Create change handlers
        this.fieldChangeHandlers = mapObjectToObject(config.fields, (field, fieldName) => value => {
          this.props.setFormField({
            fieldName,
            field: Map({
              isDirty: true,
              value: field.transform ? field.transform(value) : value,
            }),
          });

          // Trigger other fields that need to know when this one changes
          this.triggerFieldMap[fieldName].forEach(fieldNameToTrigger => {
            // Trigger the field to revalidate with its current value
            this.fieldValidators[fieldNameToTrigger].subject.onNext(
              this.props.formState.getIn(['fields', fieldNameToTrigger, 'value'])
            )
          });
        });

        if (!this.getFormState()) {
          this.props.initializeForm({
            form: new Form({
              fields: Map(mapObjectToObject(config.fields, field => new Field({
                value: field.initialValues ? field.initialValues.value : undefined,
              }))),
            }),
            formName: config.name,
          });
        }
      }

      componentWillReceiveProps(nextProps) {
        const { formState } = this.props;
        nextProps.formState.fields.forEach((field, fieldName) => {
          const isDifferent = !formState || field !== formState.fields.get(fieldName);
          // Trigger validation stream
          const { subject } = this.fieldValidators[fieldName];
          if(isDifferent && subject) {
            subject.onNext(field.value);
          }
        });
      }

      componentWillUnmount() {
        if (config.clearOnUnmount) {
          this.props.deleteForm();
        }
      }

      getFormFieldState = fieldName => this.props.formState.getIn(['fields', fieldName])

      getFormFieldChangeHandler = fieldName => this.fieldChangeHandlers[fieldName]

      getFormState = () => this.props.formState

      render() {
        const { formState } = this.props;

        const proxyProps = mapFormToProps
          ? mapFormToProps(formState)
          : { form: formState };

        // The first render happens before initialization has time to complete so only render
        // contents afterwards to avoid lots of conditional checking for state in sub components
        return formState
          ? <ComponentToWrap {...proxyProps} />
          : null;
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
