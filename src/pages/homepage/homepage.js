import React from 'react';
import { Footer } from '../../components';
import Header from './components/header.js';
import Who from './components/who.js';
import What from './components/what.js';
import How from './components/how.js';

const Homepage = () => {
	return (
		<div>
			<Header />
			<Who />
			
			<How />
			<Footer />
		</div>
	);
}

export default Homepage;