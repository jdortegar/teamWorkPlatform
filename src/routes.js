import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';
import Login from './containers/Login';
import Register from './containers/Register';
import CreateAccount from './containers/CreateAccount';

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
    <Route exact path={routesPaths.app} component={Main} />
    <SignUp>
      <Route exact path={routesPaths.login} component={Login} />
      <Route exact path={routesPaths.register} component={Register} />
      <Route exact path={routesPaths.createAccount} component={CreateAccount} />
    </SignUp>
  </Switch>
);
