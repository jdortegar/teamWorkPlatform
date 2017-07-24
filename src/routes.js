import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routing';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';

export const routesPaths = {
  app: '/app',
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
    <Redirect exact from={routesPaths.home} to={routesPaths.app} />
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={SignUp} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute exact path={routesPaths.login} component={SignUp} />
    <ProtectedRoute component={Main} />
  </Switch>
);
