import { Map } from 'immutable';
import { routerReducer } from 'react-router-redux';
import { formalizerReducer } from '../../formalizer/persistenceWrappers/reduxPersistenceWrapper';

export default (state, action) => Map({
  routing: routerReducer(state.get('routing'), action),
  formalizer: formalizerReducer(state.get('formalizer'), action),
});
