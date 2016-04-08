import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Map } from 'immutable';
import { compose } from 'ramda';

import appReducer from 'client/reducers/appReducer';

const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware,
    // createLogger({
    //   collapsed: true,
    //   stateTransformer: state => state.toJS(),
    // })
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export const initialState = Map({});

const store = createStoreWithMiddleware(appReducer, initialState);

// Enable Webpack hot module replacement for reducers
if (module.hot) {
  module.hot.accept('./reducers/appReducer', () => {
    const nextRootReducer = require('./reducers/appReducer');
    store.replaceReducer(nextRootReducer.default);
  });
}

export default store;
