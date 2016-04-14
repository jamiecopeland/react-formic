import React from 'react';
import { FuncSubject } from 'rx-react';
import { curry } from 'ramda';

import { VALID, INVALID } from '../constants/validationStates';
import { mapObjectToObject } from '../utils/objectUtils';

function upsert(list, createItem, key) {
  let item = list[key];
  if (!item) {
    item = list[key] = FuncSubject.create();
  }
  return item;
}

export function formalize(config) {
  const streams = {};

  return ComponentToWrap => {
    class FormalizeComponent extends React.Component {

      static propTypes = {
        setFormFieldValue: React.PropTypes.func,
        getFormFieldValue: React.PropTypes.func,
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
        const getValueStream = curry(upsert)(streams, () => FuncSubject.create);
        const validation$ = config.createValidationStream(getValueStream);

        const { setFormFieldValue } = this.props;

        validation$.subscribe(
          data => {
            this.setState({
              validation: data,
            });
          }
        );

        streams.email('adsf@asf.com');

        // this.subjectStreams = mapObjectToObject(streams, (value, key) => {
        //   console.log(key);
        // });

        // this.superConfig = {
        //   // Switch this over to normal reduce
        //   fields: Object.keys(config.fields).reduce((acc, fieldName) => {
        //     const field = config.fields[fieldName];
        //     const rawChangeStream = FuncSubject.create();

        //     // Synchronously set the value or checked property for the field when it it changes
        //     rawChangeStream.subscribe(
        //       event => {
        //         if (event.target.type === 'checkbox') {
        //           setFormFieldValue(fieldName, 'checked', event.target.checked);
        //         } else {
        //           const rawValue = event.target.value;
        //           setFormFieldValue(fieldName, 'value', field.valueInterceptor ? field.valueInterceptor(rawValue) : rawValue);
        //         }
        //       }
        //     );

        //     if (field.createValidationStream) {
        //       field.createValidationStream(rawChangeStream).subscribe((output) => {
        //         setFormFieldValue(fieldName, 'validity', output.validity);
        //         setFormFieldValue(fieldName, 'validityWarning', output.validity === VALID
        //           ? undefined
        //           : output.validityWarning
        //         );
        //       });
        //     } else {
        //       console.warn('Formalizer - createValidationStream is missing for field: ', fieldName); // eslint-disable-line
        //     }

        //     return {
        //       ...acc,
        //       [fieldName]: {
        //         onChange: rawChangeStream,
        //       },
        //     };
        //   }, {}),
        // };

        // this.repopulateFormalizerObject(this.props);
      }

      componentWillUpdate(nextProps) {
        // this.repopulateFormalizerObject(nextProps);
      }

      componentWillUnmount() {
        this.valueStreamSubscriptions.forEach(stream => stream.dispose());
      }

      getFormalizerField = (fieldName) => {
        // const field = this.state.validation.fields[fieldName];
        // const stream = streams[fieldName];

        return {
          ...this.state.validation.fields[fieldName],
          onChange: streams[fieldName],
        };
        // return {
        //   value: `hello ${fieldName}`,
        //   validity: INVALID,
        //   validityMessage: `You did a bad ${fieldName}!`,
        //   onChange: value => { console.log('heard value change: ', value); },
        // };
      }

      repopulateFormalizerObject(props) {
        // const { getFormFieldValue } = props;
        // const formalizerObject = {
        //   fields: Object.keys(this.superConfig.fields).reduce((acc, fieldName) => {
        //     const field = this.superConfig.fields[fieldName];
        //     const validityWarning = getFormFieldValue(fieldName, 'validityWarning');

        //     const newAcc = {
        //       ...acc,
        //       [fieldName]: {
        //         checked: getFormFieldValue(fieldName, 'checked'),
        //         value: getFormFieldValue(fieldName, 'value'),
        //         validity: getFormFieldValue(fieldName, 'validity'),
        //         onChange: field.onChange,
        //       },
        //     };


        //     if (validityWarning) {
        //       newAcc[fieldName].validityWarning = validityWarning;
        //     }

        //     return newAcc;
        //   }, {}),
        //   validity: Object.keys(this.superConfig.fields).reduce((acc, fieldName) => {
        //     return getFormFieldValue(fieldName, 'validity') === VALID && acc === VALID
        //     ? VALID : INVALID;
        //   }, VALID),
        //   errorLabelMap: config.errorLabelMap,
        // };

        // this.formalizerObject = formalizerObject;
      }

      render() {
        return (
          <div>
            <ComponentToWrap formalizer={this.state.validation} />
            }
          </div>
        );
      }
    }

    return config.persistenceWrapper(FormalizeComponent);
  };
}
