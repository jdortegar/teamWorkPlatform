import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';

class OrgInvite extends Component {

	constructor(props) {
		super(props);
		this.state = {term: ''};
	}

	handleChange(term) {
		this.setState({term});

		// Todo: Implement Autocomplete function
	}

	render() {
		const country = this.state.country;
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>

				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Invite Users </h1>
						</div>
						<div className="clearpadding">

							<p className="normal-size clearpadding">
								Invite Users by email address and manage invited users below.
							</p>
						</div>
						<br />
						<form>
							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									value="JamesArnold@GeneralPurposeOrganization.org"
									placeholder="User Email"
									className="col-md-12 placeholder_search"
								/>
							</div>

							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									value="PeterParker@GeneralPurposeOrganization.org"
									placeholder="User Email"
									className="col-md-12 placeholder_search"
								/>
							</div>
							<div className="center">
								<Button className="overwrite-button">
									<i className="fa fa-plus-circle clearpadding" />
								</Button>
							</div>

	 						<br />


							<div className="row">
								<Link to="/resetpass">
									<Button
										type="submit"
										bsStyle="success"
										className="col-md-12" >
											SEND 2 INVITES
									</Button>
								</Link>
							</div>
							<br />

							<div className="clearpadding">
								<hr />
								<div className="selected">
									JamesArnold@GeneralPurposeOrganization.org
								</div>
								<hr />
								<div className="selected">
									PeterParker@GeneralPurposeOrganization.org
								</div>
								<hr />
								<div>
									Osboume_Computing_Org
								</div>

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

export default OrgInvite;
