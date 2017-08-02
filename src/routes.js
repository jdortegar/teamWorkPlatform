import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import _ from 'lodash';
import { ProtectedRoute, PublicRoute } from './routing';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';
import Robots from './layouts/Robots';

export const routesPaths = {
  register: '/register',
  verifyAccount: '/verifyAccount/:uuid',
  createAccount: '/createAccount',
  login: '/login',
  logout: '/logout',
  home: '/',
  app: '/app',
  chat: '/app/chat/:conversationId',
  integrations: '/app/integrations/:subscriberOrgId',
  robots: '/robots.txt'
};

export default (
  <Switch>
    <Redirect exact from={routesPaths.home} to={routesPaths.app} />
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={SignUp} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute exact path={routesPaths.login} component={SignUp} />
    <PublicRoute exact path={routesPaths.robots} component={Robots} />
    <ProtectedRoute component={Main} />
  </Switch>
);

export function extractQueryParams(props) {
  const { search } = props.location;
  if ((search) && (search.length > 0)) {
    const searchParams = new URLSearchParams(search.slice(1));
    return searchParams ? _.fromPairs(Array.from(searchParams.entries())) : {};
  }
  return {};
}
