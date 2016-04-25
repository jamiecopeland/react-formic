import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './components/screens/root/Root';
import NotFound from './components/screens/notFound/NotFound';


// Shim form pages
import NewsletterSignUpForm from './components/elements/newsletterSignUpForm/NewsletterSignUpForm';
import EverythingForm from './components/elements/everythingForm/EverythingForm';

const NewsletterSignUpScreen = () => (<NewsletterSignUpForm />);
const EverythingScreen = () => (<EverythingForm />);

export function createRoutes(store) {
  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.get('routing'),
  });

  return (
    <Router history={history}>
      <Route path="/" component={Root}>
        <Route path="newsletter-sign-up" component={NewsletterSignUpScreen} />
        <Route path="everything" component={EverythingScreen} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  );
}
