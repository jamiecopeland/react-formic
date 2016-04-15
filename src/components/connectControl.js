import React, { Component } from 'react';

export default function connectControl(WrappedComponent) {
  class ConnectControl extends Component {
    static contextTypes = {
      getFormalizerField: React.PropTypes.func
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getFormalizerField={this.context.getFormalizerField}
        />
      );
    }
  }

  return ConnectControl;
}
