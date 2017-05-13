import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Header, Footer, FieldGroup } from '../../components';
import HeaderNavbar from '../homepage/components/header_navbar';


const ForgotPass = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<section>
			<div className="row">
				<div className="col-md-4 col-md-offset-4">
					<div className="header">
						<h1>
							Forgot Password
						</h1>
					</div>
					<div className="col-md-12 forgot-notice clearpadding">
						<p>
							An email will be sent to your address for you to reset your password.
						</p>
					</div>

					<form>
						<div className="row">
							<FieldGroup
								id="email-reset"
								type="email"
								placeholder="Email"
								label="Email"
								classn="col-md-12 clearpadding"
							/>
						</div>
						<div className="row">
							<Link to="/resetpass">
								<Button
									type="submit"
									bsStyle="primary"
									className="col-md-12 signup-submit" >
										Reset Password
								</Button>
							</Link>
					</div>
					</form>

					<div className="fill-vertical">
					</div>
				</div>
			</div>
			</section>
			<Footer />
		</div>
	);
}

export default ForgotPass;
