import React from 'react';
import { Map } from 'immutable';

import { INVALID } from '../constants/validationStates';
import { mapObjectToObject } from 'formalizer/lib/utils/objectUtils';
import { logImmutable } from '../utils/immutableUtils';

import {
  // DELETE_FORMALIZER_FORM,
  // INITIALIZE_FORMALIZER_FORM,
  // SET_FORMALIZER_FIELD,

  Field,
  Form,
} from 'formalizer/lib/persistenceWrappers/reduxPersistenceWrapper';

export const INITIAL_FORM_STATE = { fields: {}, validity: INVALID };

export function formalize(config, mapFormToProps) {
  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        deleteForm: React.PropTypes.func.isRequired,
        initializeForm: React.PropTypes.func.isRequired,
        setFormField: React.PropTypes.func.isRequired,
        getFormState: React.PropTypes.func.isRequired,
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
        this.fieldChangeHandlers = mapObjectToObject(config.fields, (field, fieldName) => value => {
          this.props.setFormField({
            fieldName,
            field: Map({
              value: field.transform ? field.transform(value) : value,
            }),
          });
        });

        if (!this.getFormState()) {
          this.props.initializeForm({
            form: new Form({
              fields: Map(mapObjectToObject(config.fields, field => new Field({
                value: field.initialValues.value,
              }))),
            }),
            formName: config.name,
          });
        }
      }

      componentWillUnmount() {
        if (config.clearOnUnmount) {
          this.props.deleteForm();
        }
      }

      getFormFieldState = fieldName => this.props.getFormState().getIn(['fields', fieldName])

      getFormFieldChangeHandler = fieldName => this.fieldChangeHandlers[fieldName]

      getFormState = () => this.props.getFormState()

      render() {
        const formProps = mapFormToProps
          ? mapFormToProps(this.props.getFormState())
          : { form: this.props.getFormState() };

        // The first render happens before initialization has time to complete so only render
        // contents afterwards to avoid lots of conditional checking for state in sub components
        return this.props.getFormState()
          ? <ComponentToWrap {...formProps} />
          : null;
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
