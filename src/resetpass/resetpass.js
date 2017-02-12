import React from 'react';
import Header from '../signup/components/header';
import Footer from '../homepage/components/footer';
import FieldGroup from '../components/formgroup';
import Button from 'react-bootstrap/lib/Button';


const ResetPass = () => {
	return (
		<div className="container-fluid">
			<Header />
			<section>
			<div className="row">
				<div className="col-md-6 col-md-offset-6 signup-fill">
					<h1>
						Reset Password
					</h1>

					<form>
						<div className="row">
							<FieldGroup 
								id="reset-password"
								type="password"
								placeholder="Enter new password"
								help=""
								classn="col-md-8 signup-small clearpadding"
							/>

							<FieldGroup 
								id="reset-password-re"
								type="password"
								placeholder="Re-enter password"
								help=""
								classn="col-md-8 signup-small clearpadding"
							/>
						</div>
						<div className="row">
							<div className="col-md-4 reset-password-button">
								<Button 
									type="submit" 
									bsStyle="default" 
									className="col-md-12 reset-cancel" >
										Cancel
								</Button>
							</div>
							
							<Button 
								type="submit" 
								bsStyle="primary" 
								className="col-md-4" >
									Reset Password
							</Button>
						
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

export default ResetPass;


