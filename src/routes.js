import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Habla from './habla';
import Homepage from './homepage/homepage.js';
import SignUp from './signup/signup';
import ForgotPass from './forgotpass/forgotpass';
import ResetPass from './resetpass/resetpass';
import Team from './team/team';

export default (
	<Route path="/" component={Team}>
		<IndexRoute component={Homepage} />
		<Route path="/signup" component={SignUp} />
		<Route path="/forgotpass" component={ForgotPass} />
		<Route path="/resetpass" component={ResetPass} />
		<Route path="/team" component={Team} />
	</Route>
);

// <Route path="/signin" component={SignIn} />