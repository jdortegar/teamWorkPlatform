import React from 'react';
import {Image} from 'react-bootstrap/lib';
import { Footer } from '../../components';
import HeaderNavbar from '../homepage/components/header_navbar';
import CCG from '../ccg/CCG';

const Product = () => {
	return (
		<div className="container-graph row test1">
			<HeaderNavbar />
			<CCG />
			<Image src="https://c1.staticflickr.com/3/2863/33896983372_a59764b0e8_o.png" responsive />
			<Footer />
		</div>
	);
};

export default Product;
