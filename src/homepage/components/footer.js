import React from 'react';
import FooterLinks from './footer_links.js';
import FooterSocialIcon from './footer_social_icon.js';

const Footer = () => {
	return (
		<footer className="clearfix">
				<FooterLinks />
				<FooterSocialIcon />
		</footer>
	);
}

export default Footer;