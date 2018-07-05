import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { paths } from '../../routes';
import Register from '../../pages/Register';
import CreateAccount from '../../containers/CreateAccount';
import VerifyAccount from '../../containers/VerifyAccount';
import RecoverPassword from '../RecoverPassword';
import SetNewPassword from '../../containers/SetNewPassword';
import Header from '../../components/Header';
import './styles/signup.css';

function SignUp() {
  return (
    <div className="signup-main-div">
      <Header />
      <div className="signup-body">
        <Switch>
          <Route exact path={paths.register} component={Register} />
          <Route exact path={paths.createAccount} component={CreateAccount} />
          <Route exact path={paths.verifyAccount} component={VerifyAccount} />
          <Route exact path={paths.recoverPassword} component={RecoverPassword} />
          <Route exact path={paths.setNewPassword} component={SetNewPassword} />
        </Switch>
      </div>
    </div>
  );
}

export default SignUp;
