import { createStore, applyMiddleware, compose } from 'redux';
import { batchedSubscribe } from 'redux-batched-subscribe';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { toJS } from 'react-formic/lib/utils/immutableUtils';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(
      thunkMiddleware,
      createLogger({
        collapsed: true,
        stateTransformer: state => state.toJS(),
        actionTransformer: action => toJS(action),
      })
    ),
    // Prevent unecessary re-renders
    batchedSubscribe((notify) => requestAnimationFrame(notify)),
    // TODO Add this conditionally
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
