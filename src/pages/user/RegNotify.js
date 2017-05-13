import React from 'react';
import HeaderNavbar from '../homepage/components/header_navbar';
import { Header, Footer } from '../../components';


const RegNotify = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<h2> Registration Successful!</h2>
			<p className="center"> Check your email and click on the validation link to complete your registration </p>
			<div className="fill-vertical">
			</div>
			<Footer />
		</div>
	);
}

export default RegNotify;
