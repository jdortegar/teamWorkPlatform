import React from 'react';
import { Link } from 'react-router';
import HeaderNavbar from '../homepage/components/header_navbar';
import { Header, Footer } from '../../components';
import MSecurity from './mSecurity';


const Security = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<MSecurity />
			<Footer />
		</div>
	);
}

export default Security;