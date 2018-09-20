import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { paths } from 'src/routes';
import { Register } from 'src/pages';
import { RecoverPassword } from 'src/layouts';
import { CreateAccount, VerifyAccount, SetNewPassword } from 'src/containers';
import { Header } from 'src/components';
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
