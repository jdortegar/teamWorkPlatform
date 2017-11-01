import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col } from 'antd';
import { routesPaths } from '../../routes';
import Register from '../../containers/Register';
import CreateAccount from '../../containers/CreateAccount';
import Login from '../../containers/Login';
import VerifyAccount from '../../containers/VerifyAccount';
import './styles/signup.css';

// TODO: add <Route exact path={routesPaths.verifyAccount} component={VerifyAccount} /> below.
function SignUp() {
  // TODO: need VerifyAccount component.
  return (
    <div className="signup-main-div">
      <Row type="flex" justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={{ span: 20 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <img alt="Habla AI" className="signup-logo" src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" />
            <h2>Habla AI</h2>
          </div>
          <Switch>
            <Route exact path={routesPaths.register} component={Register} />
            <Route exact path={routesPaths.createAccount} component={CreateAccount} />
            <Route exact path={routesPaths.verifyAccount} component={VerifyAccount} />
            <Route exact path={routesPaths.login} component={Login} />
          </Switch>
        </Col>
      </Row>
    </div>
  );
}

export default SignUp;
