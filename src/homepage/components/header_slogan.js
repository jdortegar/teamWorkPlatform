import React from 'react';
import HeaderFastRegister from './header_fast_register.js';
import HeaderScrollMouse from './header_scroll_mouse.js'

const HeaderSlogan = () => {
	return (
		<div className="logo-text">
			<p className="slogan">
                NAVIGATE YOUR DARK DATA,<br />
                NEVER SWIM THROUGH LOST FILES AGAIN
            </p>
            <p className="slogan-small">
            	Keep your goals in clear focus!
            </p>
 			<HeaderFastRegister />
 			<HeaderScrollMouse />          
		</div>
	);
}

export default HeaderSlogan;