import React from 'react';
import HeaderNavbar from './header_navbar.js'
const HeaderLogo = () => {
	return (
		<div className="group_logo clearfix">
			<a href="index.html">
				<img className="logo" src='/resources/img/logo.png' />
			</a>
			<div className="logo-habla">Habla</div>
			<HeaderNavbar />
		</div>
	);
}

export default HeaderLogo;