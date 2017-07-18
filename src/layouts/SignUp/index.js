import React from 'react';
import { connect } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import CreateAccount from '../../containers/CreateAccount';
import Login from '../../containers/Login';
import Register from '../../containers/Register';
import { routesPaths } from '../../routes';

const SignUp = (props) => {
  const { mainDiv } = inlineStyles;

  return (
    <div style={mainDiv}>
      <div className="container">
        <div className={`col-xs-12 col-md-offset-3 col-md-6 flip-container ${props.flip}`}>
          <div className="flipper" style={{ marginTop: '80px'}}>
            <Switch>
              <Route exact path={routesPaths.register} component={Register} />
              <Route exact path={routesPaths.createAccount} component={CreateAccount} />
              <Route exact path={routesPaths.login} component={Login} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

const inlineStyles = {
  mainDiv: {
    minHeight: '100vh',
    backgroundColor: '#EDF0F1'
  }
}

function mapStateToProps (state) {
  return { flip: state.registerReducer.flip };
}

export default connect(mapStateToProps)(SignUp);
