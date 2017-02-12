import React from 'react';
import Header from '../signup/components/header';
import Footer from '../homepage/components/footer';
import FieldGroup from '../components/formgroup';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';

const ForgotPass = () => {
	return (
		<div className="container-fluid">
			<Header />
			<section>
			<div className="row">
				<div className="col-md-6 col-md-offset-6 signup-fill">
					<h1>
						Forgot Password
					</h1>

					<form>
						<div className="row">
							<FieldGroup 
								id="email-reset"
								type="email"
								placeholder="Email"
								help=""
								classn="col-md-8 signup-small clearpadding"
							/>
						</div>
						<div className="row">
							<Link to="/resetpass">
								<Button 
									type="submit" 
									bsStyle="primary" 
									className="col-md-4 col-md-offset-4" >
										Reset Password
								</Button>
							</Link>
					</div>
					</form>
					<div className="col-md-8 forgot-notice clearpadding">
						<p>
							An email will be sent to your address for you to reset your password.
						</p>
					</div>
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