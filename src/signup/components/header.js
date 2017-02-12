import React from 'react';
import Habla from '../../habla.js';
import { Link } from 'react-router';
import FieldGroup from '../../components/formgroup';
import Form from 'react-bootstrap/lib/Form';
import Button from 'react-bootstrap/lib/Button';

const Header = () => {
	return (
		<div className="row header-login">
			<div className="col-md-1">
				<Link to="/">
					<img className="logo-login" src='/resources/img/logo.png' />
				</Link>
			</div>
			<div className="col-md-6 col-md-offset-5">
				<form className="row">
					<FieldGroup 
						id="username"
						type="text"
						placeholder="username"
						help="&nbsp;"
						classn="col-md-4 form-login"
					/>
				
					<FieldGroup 
						id="password"
						type="Password"
						placeholder="password"
						help={<Link to="/" className="forgot-password">Forgot Password?</Link>}
						classn="col-md-4 form-login"
					/>
					
					<Button 
						type="submit" 
						bsStyle="primary" 
						className="col-md-4 login-submit" >
							Log In
					</Button>
					
				
				</form>
			</div>

		</div>
	);
}

export default Header;