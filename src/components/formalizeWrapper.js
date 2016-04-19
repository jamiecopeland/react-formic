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
        initializeForm: React.PropTypes.func.isRequired,
        setFormField: React.PropTypes.func.isRequired,
        getFormState: React.PropTypes.func.isRequired,
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
        this.valueChangeHandlers = mapObjectToObject(config.fields, field => value => {
          console.log('heard the value change', value);
        });

        this.props.initializeForm({
          form: new Form({
            fields: Map({
              firstName: Field({
                value: 'Jamie',
              }),
            }),
          }),
          formName: config.name,
        });
      }

      componentWillUnmount() {

      }

      getFormalizerField = fieldName => ({
        ...(this.props.getFormState().getIn(['fields', fieldName])),
        //onChange: rawValueStreams[fieldName],
      })

      // getFormalizerForm = includeOnChangeHandlers => {
      //   const formState = this.props.getFormState();
      //   return includeOnChangeHandlers
      //   ? {
      //     ...formState,
      //     fields: mapObjectToObject(rawValueStreams, (valueStream, fieldName) => ({
      //       ...formState.fields[fieldName],
      //       onChange: valueStream,
      //     })),
      //   }
      //   : formState;
      // }

      render() {
        const formProps = mapFormToProps
          ? mapFormToProps(this.props.getFormState())
          : { form: this.props.getFormState() };
        return <ComponentToWrap {...formProps} />;
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
