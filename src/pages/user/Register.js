import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import { reduxForm } from 'redux-form';
import { Checkbox, Button } from 'react-bootstrap/lib';
import { Header, Footer, FieldGroup } from '../../components';
import { email_changed} from '../../actions/index';
import HeaderNavbar from '../homepage/components/header_navbar';
import helper from '../../components/Helper';



class Register extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	whenPressSubmit(event) {
		event.preventDefault();
		if (validateEmail(this.props.email_in)) {
			helper.register(this.props.email_in)
			.then(response => {
				this.context.router.push('/successful');
			})
			.catch(error => console.log(error))
		}
	}

	type_email(input) {
		this.props.email_changed(input)
	}
	render() {
		// const { fields: emailcheck, handleSubmit } = this.props;
		return (
			<div className="container-fluid">
				<HeaderNavbar />
				<section>
					<div className="row">

						<div className="col-md-4 col-md-offset-4">
							<div className="header">
								<h1>Signup</h1>
							</div>
							<form onSubmit={this.whenPressSubmit.bind(this)}>
								<div className="row">
									<FieldGroup
										type="email"
										placeholder="bob.jones@corporation.com"
										label="Email"
										classn="col-md-12 clearpadding"
										onChange={(event) => this.type_email(event.target.value)}
										value={this.props.email_in}

									/>
								</div>
								<div>

								</div>
								<div className="row">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12 signup-submit" >
											REGISTER FOR HABLA
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
}

function validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}



function mapStateToProps(state) {
		return {
			email_in : state.email_auth.email
		};
}

// export default reduxForm({
// 	form: 'Register',
// 	fields: 'emailcheck',

// },mapStateToProps, {email_changed})(Register)

export default connect(mapStateToProps, {email_changed})(Register);
