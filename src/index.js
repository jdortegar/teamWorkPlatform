import React from 'react';
import ReactDOM from 'react-dom';
import Header from './homepage/components/header.js';
import Who from './homepage/components/who.js';
import What from './homepage/components/what.js';
import How from './homepage/components/how.js';
import BottomFastRegister from './homepage/components/bottom_fast_register.js';
import Footer from './homepage/components/footer.js';

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

ReactDOM.render(<Homepage />, document.querySelector('.homepage'));