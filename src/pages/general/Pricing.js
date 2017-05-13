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
								<th className="pricing-second-column col-md-2">Free Version</th>
								<th className="pricing-third-column col-md-2 ">Small Business</th>
								<th className="pricing-fourth-column col-md-2 ">Mid-sized Business</th>
								<th className="pricing-fifth-column col-md-2">Enterprise</th>
							</tr>
							<tr className="first-row pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Pricing
								</td>
								<td className="pricing-second-column col-md-2 ">
									<span className="dollar">$</span><span className="pricing-amount">0</span>
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									<span className="dollar">$</span><span className="pricing-amount">30</span> 
									<div>
										per active user, per month
										billed annually
									</div>
									<div>
										$36 billed monthly
									</div>
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									<span className="dollar">$</span><span className="pricing-amount">40</span> 
									<div>
										per active user, per month
										billed annually
									</div>
									<div>
										$50 billed monthly
									</div>
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									<span className="dollar">$</span><span className="pricing-amount">50</span> 
									<div>
										per active user, per month
										billed annually
									</div>
									<div>
										$64 billed monthly
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
								<td className="pricing-second-column col-md-2 ">
									Limited
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									YES, SB version
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									YES, MM version
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									YES, LE version
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									GESSE
								</td>
								<td className="pricing-second-column col-md-2 ">
									Limited
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes, enhanced
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Threaded
									Conversations
								</td>
								<td className="pricing-second-column col-md-2 ">
									5GB
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									100GB
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									500GB
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									5TB+
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Google Drive, Dropbox,...

								</td>
								<td className="pricing-second-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Private & Public Team Room, Policies
								</td>
								<td className="pricing-second-column col-md-2 ">
									Public Only
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Apps and Service Integrations
								</td>
								<td className="pricing-second-column col-md-2 ">
									2 apps or svcs
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									4 apps or svcs
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									8 apps or svcs
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									12 apps or svcs
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
								<td className="pricing-second-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Custom Retention Policies for Messages & Files, File Sharing
								</td>
								<td className="pricing-second-column col-md-2 ">
									Limited
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									2-Factor Auth/Google Oauth, LDAP int.
								</td>
								<td className="pricing-second-column col-md-2 ">
									Habla OpenLDAP only
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									Yes
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									SSO and AD Sync with OneLogin, Okta, Ping
								</td>
								<td className="pricing-second-column col-md-2 ">
									No
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									No
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									Yes
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									Yes
								</td>
								<td className="col-md-1 space"></td>
							</tr>
							<tr className="pricing-row">
								<td className="col-md-1 space"></td>
								<td className="pricing-first-column col-md-2 odd-column">
									Support
								</td>
								<td className="pricing-second-column col-md-2 ">
									FAQs
								</td>
								<td className="pricing-third-column col-md-2 odd-column">
									12/5 Email and Phone
								</td>
								<td className="pricing-fourth-column col-md-2 ">
									12/5 Email and Phone
								</td>
								<td className="pricing-fifth-column col-md-2 odd-column">
									24/7 Email and Phone
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