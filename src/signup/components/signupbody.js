import React from 'react';
import FieldGroup from '../../components/formgroup';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Link } from 'react-router';
import Button from 'react-bootstrap/lib/Button';

const SignUpBody = () => {
	return (
		<section>
		<div className="row">
			<div className="col-md-4 col-md-offset-2 signup-guide">
				<h5>
					HEY, THERE, JOINING IS AS SIMPLE AS 1,2,3
				</h5>
				<p>
					1: Fill in the details and below and tap 'JOIN'
				</p>
				<p>
					2: Verify your email address by clicking 'VERIFY' in the verification email we send you
				</p>
				<p>
					3: Lean back and relax, youre done
				</p>
			</div>
			<div className="col-md-6 signup-fill">
				<h1>
					Sign Up
				</h1>

				<form>
					<div className="row">
						<FieldGroup 
							id="firstname"
							type="text"
							placeholder="First Name"
							help=""
							classn="col-md-4 signup-small"
						/>
			
						<FieldGroup 
							id="lastname"
							type="text"
							placeholder="Last Name"
							help=""
							classn="col-md-4 signup-small"
						/>
					</div>
					<div className="row">
						<FieldGroup 
							id="signup-email"
							type="email"
							placeholder="Email"
							help=""
							classn="col-md-8 signup-small"
						/>
					</div>
					<div className="row">
						<FieldGroup 
							id="signup-username"
							type="text"
							placeholder="Username"
							help=""
							classn="col-md-8 signup-small"
						/>
					</div>
					<div className="row">
						<FieldGroup 
							id="signup-password"
							type="password"
							placeholder="Select Password"
							help=""
							classn="col-md-8 signup-small"
						/>
					</div>
					<div className="row">
						<FieldGroup 
							id="signup-password-re"
							type="password"
							placeholder="Re-enter Password"
							help=""
							classn="col-md-8 signup-small"
						/>
					</div>
					<div className="row">
						<Checkbox className="col-md-8 clearpadding">
							I have read and understand the privacy policy and <Link to="#" className="forgot-password">term of service</Link>
						</Checkbox>
					</div>
					<div className="row">
						<Button 
							type="submit" 
							bsStyle="primary" 
							className="col-md-4 col-md-offset-4 signup-submit" >
								Create Account
						</Button>
					</div>

				</form>
			</div>
		</div>
		</section>
	);
}

export default SignUpBody;