import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { routesPaths } from '../../routes';
import Register from '../../containers/Register';
import CreateAccount from '../../containers/CreateAccount';
import VerifyAccount from '../../containers/VerifyAccount';
import RecoverPassword from '../RecoverPassword';
import SetNewPassword from '../SetNewPassword';
import Header from '../../components/Header';
import './styles/signup.css';

// TODO: add <Route exact path={routesPaths.verifyAccount} component={VerifyAccount} /> below.
function SignUp() {
  // TODO: need VerifyAccount component.
  return (
    <div className="signup-main-div">
      <Header />
      <div className="signup-body">
        <Switch>
          <Route exact path={routesPaths.register} component={Register} />
          <Route exact path={routesPaths.createAccount} component={CreateAccount} />
          <Route exact path={routesPaths.verifyAccount} component={VerifyAccount} />
          <Route exact path={routesPaths.recoverPassword} component={RecoverPassword} />
          <Route exact path={routesPaths.setNewPassword} component={SetNewPassword} />
        </Switch>
      </div>
    </div>
  );
}

export default SignUp;
