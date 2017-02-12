import React from 'react';
import Header from './components/header';
import SignUpBody from './components/signupbody';
import Footer from '../homepage/components/footer'

const SignUp = () => {
	return (
		<div className="container-fluid">
			<Header />
			<SignUpBody />
			<Footer />
		</div>
	);
}

export default SignUp;