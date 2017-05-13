import React from 'react';
import { Link } from 'react-router';
import { FieldGroup } from '../components';
import { Form, Button } from 'react-bootstrap/lib';

const Header = (user) => {
	return (
		<div className="row header-login">
			<div className="col-md-1">
				<Link to="/">
				{/*	<img className="logo-login" src='/resources/img/logo.png' /> */}
					<img className="logo-login" src='https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png' /> 
				</Link>
			</div>

			{ user.user != null ?
				(
					<div className = "header-account">
						{user.user}
						<div>
							<Link to="/">
							{/* TODO: Create section login in redux, then clear when user click on Logout */}
								Logout
							</Link>
						</div>
					</div>
				):(
					<div className="col-md-6 col-md-offset-5">
						<form className="row">
							<FieldGroup
								id="username"
								type="text"
								classheight="delheight"
								placeholder="username"
								help="&nbsp;"
								classn="col-md-4 form-login"
							/>

							<FieldGroup
								id="password"
								type="Password"
								classheight="delheight"
								placeholder="password"
								help={<Link to="/forgotpass" className="forgot-password">Forgot Password?</Link>}
								classn="col-md-4 form-login"
							/>

							<Button
								type="submit"
								bsStyle="primary"
								className="col-md-2 login-submit" >
									Login
							</Button>
							<i className="col-md-2 ion-help-circled">
							</i>


						</form>
					</div>
				)}
		</div>
	);
}

export { Header };

