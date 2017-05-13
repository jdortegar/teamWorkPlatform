import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Header, Footer, FieldGroup } from '../../components';
import HeaderNavbar from '../homepage/components/header_navbar';


const ResetPass = () => {
	return (
		<div className="container-fluid">
			<HeaderNavbar />
			<section>
			<div className="row">
				<div className="col-md-4 col-md-offset-4">
					<div className="header">
						<h1>
							Reset Password
						</h1>
					</div>
					<form>
						<div className="row">
							<FieldGroup
								id="reset-password"
								type="password"
								placeholder="Enter new password"
								help=""
								classn="col-md-12 clearpadding"
							/>

							<FieldGroup
								id="reset-password-re"
								type="password"
								placeholder="Re-enter password"
								help=""
								classn="col-md-12 clearpadding"
							/>
						</div>
						<div className="row">


							<Button
								type="submit"
								bsStyle="primary"
								className="col-md-12 signup-submit" >
									Reset Password
							</Button>

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

export default ResetPass;
