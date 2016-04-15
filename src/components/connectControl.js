import React, { Component } from 'react';

export default function connectControl(WrappedComponent) {
  class ConnectControl extends Component {
    static contextTypes = {
      getFormalizerField: React.PropTypes.func,
      getFormalizerErrorLabel: React.PropTypes.func,
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getFormalizerField={this.context.getFormalizerField}
          getFormalizerErrorLabel={this.context.getFormalizerErrorLabel}
        />
      );
    }
  }

  return ConnectControl;
}
