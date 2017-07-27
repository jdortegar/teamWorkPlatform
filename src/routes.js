import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routing';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';

export const routesPaths = {
  register: '/register',
  verifyAccount: '/verifyAccount/:uuid',
  createAccount: '/createAccount',
  login: '/login',
  logout: '/logout',
  home: '/',
  app: '/app',
  chat: '/app/chat/:conversationId',
  integrations: '/app/integrations/:subscriberOrgId'
};

export default (
  <Switch>
    <Redirect exact from={routesPaths.home} to={routesPaths.app} />
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={SignUp} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute exact path={routesPaths.login} component={SignUp} />
    <ProtectedRoute component={Main} />
  </Switch>
);
