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
            const rawChangeFunctionSubject = FuncSubject.create();

            // const rawValueStream = rawChangeFunctionSubject
            //   .map(event => event.target.value);

            // If the field has a createValueStream method use that,
            // otherwise default to the raw value

            // const valueStream = field.createValueStream
            //   ? field.createValueStream(rawChangeFunctionSubject)
            //   : rawValueStream;
            //  .push(
            //   valueStream.subscribe(value => setFormFieldValue(fieldName, 'value', value))
            // );


            rawChangeFunctionSubject.subscribe(
              event => {
                if (event.target.type === 'checkbox') {
                  setFormFieldValue(fieldName, 'checked', event.target.checked);
                } else {
                  setFormFieldValue(fieldName, 'value', event.target.value);
                }
              }
            );


            if (field.createOutputStream) {
              field.createOutputStream(rawChangeFunctionSubject).subscribe((output) => {
                setFormFieldValue(fieldName, 'validity', output.validity);
                setFormFieldValue(fieldName, 'validityWarning', output.validity === VALID
                  ? undefined
                  : output.validityWarning
                );
              });
            } else {
              console.warn('Formalizer - createOutputStream is missing for field: ', fieldName); // eslint-disable-line
            }

            return {
              ...acc,
              [fieldName]: {
                onChange: rawChangeFunctionSubject,
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
