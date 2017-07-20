import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';
import VerifyAccount from './containers/VerifyAccount';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export const routesPaths = {
  home: '/',
  register: '/register',
  login: '/login',
  logout: '/logout',
  chat: '/chat/:conversationId',
  integrations: '/integrations/:subscriberOrgId',
  subpage: '/subpage',
  createAccount: '/createAccount',
  verifyAccount: '/verifyAccount/:uuid'
};

export default (
  <Switch>
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={VerifyAccount} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute exact path={routesPaths.login} component={SignUp} />
    <ProtectedRoute component={Main} />
    <Main />
  </Switch>
);
