import React from 'react';
import Header from './components/header.js';
import Who from './components/who.js';
import What from './components/what.js';
import How from './components/how.js';
import BottomFastRegister from './components/bottom_fast_register.js';
import Footer from './components/footer.js';

const Homepage = () => {
	return (
		<div>
			<Header />
			<Who />
			<What />
			<How />
			<BottomFastRegister />
			<Footer />
		</div>
	);
}

export default Homepage;