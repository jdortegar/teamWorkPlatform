import React from 'react';
import { Link } from 'react-router';
const Footer = () => {
	return (
		<footer className="clearfix">

			<div className = "row center">      	
	            <div className="col-md-2 col-sm-6 col-xs-12 col-md-offset-2">
	                <div className="footer-nav">
                   		<p className="footer-title">USING HABLA</p>
                    	<p><Link to="/graph" className="footer-link">Product</Link></p>
                    	<p><Link to="/pricing" className="footer-link">Pricing</Link></p>
                    	<p><a href="#/" className="footer-link">Support</a></p>
                    	<p><Link to="/app-directory" className="footer-link">App Directory</Link></p>
                    	<p><a href="#/" className="footer-link">API</a></p>
                   
	                </div>
	            </div>
	            
	            <div className="col-md-2 col-sm-6 col-xs-12">
	                <div className="footer-nav">
                   		<p className="footer-title">HABLA</p>
                    	<p>
                    		<a href="https://angel.co/habla/jobs" target="_blank" className="footer-link">Jobs</a>
                    	</p>
                    	<p><a href="#/" className="footer-link">Customers</a></p>
                    	<p><a href="#/" className="footer-link">Developers</a></p>
                    	<p><a href="#/" className="footer-link">Events</a></p>
                    	<p><a href="#/" className="footer-link">Brand Guidelines</a></p>
                    	<p><a href="#/" className="footer-link">Blog</a></p>
                    	<p><a href="#/" className="footer-link">About</a></p>
                   
	                </div>
	            </div>
	            
	            <div className="col-md-2 col-sm-6 col-xs-12">
	                <div className="footer-nav">
                   		<p className="footer-title">LEGAL</p>
                    	<p><Link to="/privacy" className="footer-link">Privacy</Link></p>
                    	<p><Link to="/security" className="footer-link">Security</Link></p>
                    	<p><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></p>   
	                </div>
	            </div>
	            
	            <div className="col-md-2 col-sm-6 col-xs-12">
	                <div className="footer-nav">
                   		<p className="footer-title">GETTING STARTED</p>
                    	<p><a href="#/" className="footer-link">Download desktop app</a></p>
                    	<p><a href="#/" className="footer-link">Download mobile app</a></p>
                    	<p><a href="#/" className="footer-link">Habla at Work</a></p>
                    	<p><a href="#/" className="footer-link">Habla Guides</a></p>
                    	<p><a href="#/" className="footer-link">Video Guides</a></p>
                   		<p><a href="#/" className="footer-link">Status</a></p>
	                </div>
	            </div>
				
			</div>

			<div className="row-full">
				<ul className="social">
					<a href="#" className = "ion-social-facebook footer-icon"></a>
					<a href="#" className = "ion-social-twitter footer-icon"></a>
					<a href="#" className = "ion-social-youtube footer-icon"></a>
				</ul>
			</div>
		</footer>
	);
}

export { Footer };