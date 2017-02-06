import React from 'react';
import HeaderLogo from './header_logo.js';
// import HeaderFastRegister from './header_fast_register.js';
import HeaderSlogan from './header_slogan.js';

const Header = () => {
	return (
		<header>
			<HeaderLogo />
			<HeaderSlogan />
		</header>
	);
}

export default Header;