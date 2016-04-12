import React from 'react';
import { reduceObject } from '../../../utils/objectUtils';

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

const propertyNames = ['value', 'checked', 'validity', 'validityWarning'];


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

const Visualizer = (props, { formalizer }) => (
  <div>
    <table style={tableStyle}>
      <thead>
        <tr>
          <td colSpan="2" style={titleStyle}>Formalizer Visualizer</td>
        </tr>
      </thead>
      <tbody>
        {
          reduceObject(
            formalizer.fields,
            (acc, field, fieldName) => acc
              .concat([
                <tr key={fieldName}>
                  <td colSpan="2" style={fieldTitleCellStyle}>
                    <strong>{fieldName}</strong>
                  </td>
                </tr>,
              ])
              .concat(
                propertyNames
                .filter(key => field[key] !== undefined)
                .map(key => {
                  const value = field[key];
                  return (
                    <tr key={key}>
                      <td style={propertyNameCellStyle}>{key}</td>
                      <td style={valueCellStyle}>{cleanValue(value)}</td>
                    </tr>
                  );
                })
              ),
            []
          )
        }
      </tbody>
    </table>
  </div>
);

Visualizer.contextTypes = {
  formalizer: React.PropTypes.object,
};

export default Visualizer;
