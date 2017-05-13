import React from 'react';
import { Link } from 'react-router';
import HeaderNavbar from '../homepage/components/header_navbar';
import { Header, Footer } from '../../components';
import MTermsOfService from './mTermsOfService'



const TermsOfService = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<MTermsOfService />
			<Footer />
		</div>
	);
}

export default TermsOfService;