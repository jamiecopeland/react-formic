import { Map } from 'immutable';
import { routerReducer } from 'react-router-redux';
import { formicReducer } from 'react-formic/lib/stateWrappers/reduxPersistenceWrapper';

export const ROUTING_BRANCH_NAME = 'routing';
export const FORMIC_BRANCH_NAME = 'formic';

export default (state, action) => {
  const output = Map({
    [ROUTING_BRANCH_NAME]: routerReducer(state.get(ROUTING_BRANCH_NAME), action),
    [FORMIC_BRANCH_NAME]: formicReducer(state.get(FORMIC_BRANCH_NAME), action),
  });
  return output;
};
