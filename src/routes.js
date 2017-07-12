import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomeContainer from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import SubpageContainer from './containers/Subpage';
import CreateAccount from './containers/CreateAccount';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';
import Integrations from './containers/user/Integrations';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export const routesPaths = {
  home: '/',
  register: '/register',
  login: '/login',
  integrations: '/integrations/:subscriberOrgId',
  subpage: '/subpage',
  createAccount: '/createAccount'
};

export default (
  <Switch>
    <SignUp>
      <Route exact path={routesPaths.register} component={Register} />
      <Route exact path={routesPaths.createAccount} component={CreateAccount} />
      <PublicRoute exact path={routesPaths.login} component={Login} />
    </SignUp>
    <Main>
      <Switch>
        <ProtectedRoute exact path={routesPaths.home} component={HomeContainer} />
        <ProtectedRoute exact path={routesPaths.integrations} component={Integrations} />
        <ProtectedRoute exact path={routesPaths.subpage} component={SubpageContainer} />
      </Switch>
    </Main>
  </Switch>
);

// export default (
//   <Authenticated>
//     <Route exact path={routesPaths.home} component={HomeContainer} />
//     <Route exact path={routesPaths.register} component={Register} />
//     <Route exact path={routesPaths.login} component={Login} />
//     <Switch>
//       <Route exact path={routesPaths.integrations} component={Integrations} />
//       <Route exact path={routesPaths.subpage} component={SubpageContainer} />
//     </Switch>
//   </Authenticated>
// );
