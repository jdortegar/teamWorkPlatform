import React from 'react';
import { Link } from 'react-router';
import HeaderNavbar from '../homepage/components/header_navbar';
import { Header, Footer } from '../../components';
import MPrivacy from './mPrivacy';



const Privacy = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<MPrivacy />
			<Footer />
		</div>
	);
}

export default Privacy;
