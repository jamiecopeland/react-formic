import React from 'react';
import { FuncSubject } from 'rx-react';
import { VALID, INVALID } from '../constants/validationStates';

export function formalize(config) {
  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        setFormFieldValue: React.PropTypes.func,
        getFormFieldValue: React.PropTypes.func,
      };

      static childContextTypes = {
        formalizer: React.PropTypes.object,
      }

      constructor(props) {
        super(props);

        // this.persistenceFunction = setFormFieldValue
        this.valueStreamSubscriptions = [];
      }

      getChildContext() {
        return {
          formalizer: this.formalizerObject,
        };
      }

      componentWillMount() {
        const { setFormFieldValue } = this.props;

        this.superConfig = {
          // Switch this over to normal reduce
          fields: Object.keys(config.fields).reduce((acc, fieldName) => {
            const field = config.fields[fieldName];
            const rawChangeStream = FuncSubject.create();

            // Synchronously set the value or checked property for the field when it it changes
            rawChangeStream.subscribe(
              event => {
                if (event.target.type === 'checkbox') {
                  setFormFieldValue(fieldName, 'checked', event.target.checked);
                } else {
                  const rawValue = event.target.value;
                  setFormFieldValue(fieldName, 'value', field.valueInterceptor ? field.valueInterceptor(rawValue) : rawValue);
                }
              }
            );

            if (field.createValidationStream) {
              field.createValidationStream(rawChangeStream).subscribe((output) => {
                setFormFieldValue(fieldName, 'validity', output.validity);
                setFormFieldValue(fieldName, 'validityWarning', output.validity === VALID
                  ? undefined
                  : output.validityWarning
                );
              });
            } else {
              console.warn('Formalizer - createValidationStream is missing for field: ', fieldName); // eslint-disable-line
            }

            return {
              ...acc,
              [fieldName]: {
                onChange: rawChangeStream,
              },
            };
          }, {}),
        };

        this.repopulateFormalizerObject(this.props);
      }

      componentWillUpdate(nextProps) {
        this.repopulateFormalizerObject(nextProps);
      }

      componentWillUnmount() {
        this.valueStreamSubscriptions.forEach(stream => stream.dispose());
      }

      repopulateFormalizerObject(props) {
        const { getFormFieldValue } = props;
        const formalizerObject = {
          fields: Object.keys(this.superConfig.fields).reduce((acc, fieldName) => {
            const field = this.superConfig.fields[fieldName];
            const validityWarning = getFormFieldValue(fieldName, 'validityWarning');

            const newAcc = {
              ...acc,
              [fieldName]: {
                checked: getFormFieldValue(fieldName, 'checked'),
                value: getFormFieldValue(fieldName, 'value'),
                validity: getFormFieldValue(fieldName, 'validity'),
                onChange: field.onChange,
              },
            };


            if (validityWarning) {
              newAcc[fieldName].validityWarning = validityWarning;
              if (config.createErrorMessageLabel) {
                newAcc[fieldName].errorMessageLabel = config.createErrorMessageLabel(validityWarning); // eslint-disable-line
              }
            }

            return newAcc;
          }, {}),
          validity: Object.keys(this.superConfig.fields).reduce((acc, fieldName) => {
            return getFormFieldValue(fieldName, 'validity') === VALID && acc === VALID
            ? VALID : INVALID;
          }, VALID),
        };

        this.formalizerObject = formalizerObject;
      }

      render() {
        return (<ComponentToWrap formalizer={this.formalizerObject} />);
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
