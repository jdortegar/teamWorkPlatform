import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Header, Footer, FieldGroup } from '../../components';
import { CountryDropdown } from 'react-country-region-selector';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { connect } from 'react-redux';
import LogedHeader from '../../components/LogedHeader';




class ProfileEdit extends Component {

	constructor(props) {
		super(props);
		this.state = { country: 'United States', timezone:''};
	}

	handleChange = (value) => this.setState({timezone: value})

	selectCountry (val) {
		this.setState({ country: val });
	}

	whenSubmit(event) {

	}

	render() {
		const country = this.state.country;
		return (
			<div className="container-fluid">
				<LogedHeader />
				<section>

				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Your Profile </h1>
						</div>
						<div className="clearpadding">

							<p className="normal-size clearpadding">
								Your profile is viewable by members of your team
							</p>
						</div>
						<br />
						<form>
							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Robert J.Jones"
									label="Full Name"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Bob Jones"
									label="Display Name"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="email"
									placeholder="bob.jones@corporation.com"
									label="Email"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Accounting"
									label="Department"
									classn="col-md-12 clearpadding"
								/>
							</div>



							<div className="row">
								<div><label>Timezone</label></div>
								<TimezonePicker
									defaultValue="(GMT-08:00) Pacific Time"
									placeholder="Select Timezone..."
									onChange = {this.handleChange}
									value= {this.state.timezone}
									className="col-md-12 clearpadding"
								/>
							</div>

							<div className="row form-group">
								<div className="country-selector"><label>Country</label></div>
								<CountryDropdown
									value={country}
									onChange={(val) => this.selectCountry(val)}

									defaultOptionLabel="Select Country"
									classes="form-control col-md-12 clearpadding"
								/>
							</div>
							<br />
							<div>
								<div className="preview-image">
									<i className="fa fa-user" />
								</div>
								<span><input className="file-input"
									type="file"
									 />

								<button className="btn btn-large"
									type="button"
									 >Upload</button>
								</span>
							</div>


	 						<br />
							<div className="row">
								<Link to="/profile-notify">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											UPDATE PROFILE
									</Button>
								</Link>
							</div>
							<br />
							<div className="row">
								<Link to="/org-profile">
									<Button
										type="submit"
										className="col-md-12" >
											MANAGE YOUR ORGS
									</Button>
								</Link>
							</div>
						</form>
					</div>
				</div>
				</section>
				<Footer />
			</div>
		);
	}
}
function mapStateToProps(state) {
	return {
		user: state.user.user
	}
}

export default connect(mapStateToProps,null)(ProfileEdit);
