import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './components/screens/root/Root';
import NotFound from './components/screens/notFound/NotFound';


// Shim form pages
import SignInForm from './components/elements/signInForm/SignInForm2';
import SignUpForm from './components/elements/signUpForm/SignUpForm';

const SignInScreen = () => (<SignInForm />);
const SignUpScreen = () => (<SignUpForm />);

export function createRoutes(store) {
  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.get('routing'),
  });

  return (
    <Router history={history}>
      <Route path="/" component={Root}>
        <Route path="sign-in" component={SignInScreen} />
        <Route path="sign-up" component={SignUpScreen} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  );
}
