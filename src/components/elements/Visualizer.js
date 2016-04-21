import React from 'react';

import connectForm from '../connectors/connectForm';
import { getFormValidity } from '../../utils/validationUtils';
import { VALID, INVALID, PENDING } from '../../constants/validity';

const tableStyle = {
  backgroundColor: '#EFEFEF',
};

const standardPadding = {
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '5px',
  paddingBottom: '5px',
};

const titleStyle = {
  ...standardPadding,
  backgroundColor: '#BBB',
  fontWeight: 'bold',
};

const cellStyle = {
  ...standardPadding,
  fontSize: '12px',
};

const fieldTitleCellStyle = {
  ...cellStyle,
  fontWeight: 'bold',
  backgroundColor: '#DDD',
};

const valueCellStyle = {
  ...cellStyle,
  borderBottom: 'solid 1px #DDD',
};

const propertyNameCellStyle = {
  ...cellStyle,
  borderBottom: 'solid 1px #DDD',
};

const propertyNames = ['isRequired', 'validity', 'validityMessage', 'value'].sort();

function cleanValue(value) {
  let output;

  if (value) {
    if (value === true) {
      output = 'true';
    } else if (typeof value === 'string') {
      output = `"${value}"`;
    } else {
      output = value;
    }
  } else if (value === false) {
    output = 'false';
  } else if (value === undefined) {
    output = 'undefined';
  } else if (value === null) {
    output = 'null';
  }

  return output;
}

const validityColorMap = {
  [VALID]: '#00FF00',
  [INVALID]: '#FF0000',
  [PENDING]: 'yellow',
};

const Visualizer = ({ form, style }) => (
  <div style={style}>
    <table style={tableStyle}>
      <thead>
        <tr>
          <td
            colSpan="2"
            style={{
              ...titleStyle,
              backgroundColor: validityColorMap[getFormValidity(form)]
            }}
          >Visualizer</td>
        </tr>
      </thead>
      <tbody>
        {

          form.fields.entrySeq().sort(([a], [b]) => a > b).reduce((acc, [fieldName, field]) => {
            return acc.concat([
              <tr key={fieldName}>
                <td colSpan="2" style={fieldTitleCellStyle}>
                  <strong>{fieldName}</strong>
                </td>
              </tr>,
            ])
            .concat(
              propertyNames
              // .filter(key => field[key] !== undefined)
              .map(key => (
                <tr key={`${fieldName}-${key}`}>
                  <td style={propertyNameCellStyle}>{key}</td>
                  <td style={{
                    ...valueCellStyle,
                    backgroundColor: key === 'validity' ? validityColorMap[field[key]] : 'none',
                  }}
                  >{cleanValue(field[key])}</td>
                </tr>
              ))
            );
          }, [])
        }
      </tbody>
    </table>

  </div>
);

Visualizer.propTypes = {
  form: React.PropTypes.object,
  style: React.PropTypes.object,
};

export default connectForm(form => ({ form }))(Visualizer);
