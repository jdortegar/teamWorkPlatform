import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { paths } from 'src/routes';
import { Register } from 'src/pages';
import { RecoverPassword } from 'src/layouts';
import { CreateAccount, VerifyAccount, SetNewPassword } from 'src/containers';
import { hablaBlackLogo, hablaBlackLogoIcon } from 'src/img';
import String from 'src/translations';
import { Layout } from 'antd';
import './styles/signup.css';

const AntdHeader = Layout.Header;

function SignUp() {
  return (
    <div className="signup-main-div">
      <AntdHeader className="header habla-top-menu">
        <div className="habla-top-menu-content">
          <div className="logo habla-top-menu-logo">
            <img src={hablaBlackLogo} alt={String.t('Header.logoAlt')} className="logo habla-logo-image" />
            <img src={hablaBlackLogoIcon} alt={String.t('Header.iconAlt')} className="habla-logo-image-responsive" />
          </div>
          <div className="clear" />
        </div>
      </AntdHeader>
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
