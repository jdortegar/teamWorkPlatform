import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Habla from './habla';
import Homepage from './homepage/homepage.js';
import SignUp from './signup/signup';

export default (
	<Route path="/" component={Habla}>
		<IndexRoute component={Homepage} />
		<Route path="/signup" component={SignUp} />
	</Route>
);

// <Route path="/signin" component={SignIn} />