import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { isAuthenticated } from 'src/selectors';
import { Main, Login } from 'src/containers';
import { SignUp } from 'src/layouts';
import { ProtectedRoute, PublicRoute } from './routing';
import { paths } from './paths';

const Router = ({ authenticated }) => (
  <Switch>
    <Redirect exact from={paths.home} to={paths.app} />
    <Route exact path={paths.register} component={SignUp} />
    <Route exact path={paths.verifyAccount} component={SignUp} />
    <Route exact path={paths.setNewPassword} component={SignUp} />
    <Route exact path={paths.createAccount} component={SignUp} />
    <PublicRoute path={paths.login} component={Login} authenticated={authenticated} />
    <PublicRoute path={paths.recoverPassword} component={SignUp} authenticated={authenticated} />
    <ProtectedRoute component={Main} authenticated={authenticated} />
  </Switch>
);

Router.propTypes = {
  authenticated: PropTypes.bool
};

Router.defaultProps = {
  authenticated: false
};

const mapStateToProps = state => ({ authenticated: isAuthenticated(state) });

export default withRouter(connect(mapStateToProps)(Router));
