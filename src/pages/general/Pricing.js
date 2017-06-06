import React from 'react';
import { Header, Footer, FieldGroup } from '../../components';
import HeaderNavbar from '../homepage/components/header_navbar';

const Pricing = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<section>
				<div className="header">
					<h1 className="header"> Pricing Guide </h1>
				</div>
				<div>
					<table className="pricing">
						<tbody>
							<tr>
								<th className="col-md-1 space"></th>
								<th className="pricing-first-column col-md-2 "></th>
								
								<th className="pricing-third-column col-md-2 ">Bronze</th>
								<th className="pricing-fourth-column col-md-2 ">Silver</th>
								<th className="pricing-fifth-column col-md-2">Gold</th>
							</tr>
							<tr className="first-row pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Pricing
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									<span className="dollar">$</span><span className="pricing-amount">29</span> 
									<div>
										per DAU, per month
										billed annually
									</div>
									<div>
										$36 billed monthly
									</div>
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									<span className="dollar">$</span><span className="pricing-amount">49</span> 
									<div>
										per DAU, per month
										billed annually
									</div>
									<div>
										$59 billed monthly
									</div>
								</td>
								<td className="pricing-fifth-column col-md-2">
									<span className="dollar">$</span><span className="pricing-amount">99</span> 
									<div>
										per active user, per month
										billed annually
									</div>
									<div>
										$109 billed monthly
									</div>
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="second-row pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Cognitive Knowledge
									Graphing and Storage
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES, Standard CKG views
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES, Standard CKG views
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, Customizable views
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									GESSE
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									NO
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, with integrated insights
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Threaded
									Conversations
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Semantic Search
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, plus saved & shared searches
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Sentiment Analysis
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									NO
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES, threaded conversations
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, plus analysis of data from 3rd party integrations
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Data storage, avaerage
									per subcriber organization user
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									5GB
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									10GB
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									50GB
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Private & Public Team Room
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES, pus team-room-level access policies
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, plus organizational sharing, redaction/tokenization policies
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									3rd party integrations(Google Drive, Box, OneDrive, etc.)
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES, plus custom integrations
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Native apps for iOS,
									Android, Mac & Windows Desktop,
									Web
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Custom Retention Policies for Messages & Files, File Sharing
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									YES
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									YES
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									2-Factor Auth/Google Oauth, LDAP int.
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									2-Factor Auth (2FA)
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									2FA, Google OAuth
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									2FA, Google OAuth, LDAP/AD integration
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									SSO and AD Sync with OneLogin, Okta, Ping
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									NO
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									NO
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									YES
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Support
								</td>
								
								<td className="pricing-third-column col-md-2 ">
									12/5 Email
								</td>
								<td className="pricing-fourth-column col-md-2 odd-column">
									12/5 Email and Phone support
								</td>
								<td className="pricing-fifth-column col-md-2 ">
									24/7 Email and Phone support
								</td>
								<td className="col-md-1 space"></td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Pricing;