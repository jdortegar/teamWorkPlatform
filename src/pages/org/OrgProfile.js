import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import { connect } from 'react-redux';
import helper from '../../components/Helper';

class OrgProfile extends Component {

	constructor(props) {
		super(props);
		this.state = {orgs: []};
		this.renderOrganizations = this.renderOrganizations.bind(this);
	}

	handleChange(term) {
		this.setState({term});
	}

	componentWillMount() {
		this.state.orgs = this.props.orgs;
	}

	renderOrganizations() {
		
	}

	render() {
		const country = this.state.country;
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>

				<div className="row">
					<div className="col-md-12">
						<div className="header">
							<h1> Your Organizations </h1>
						</div>
						

						<p className="normal-size center">
							Within the Hablasphere everything is organized. {'\n'}
							Here is a list of Organizations you are currently the admin for
						</p>
						
						<br />

						<table className="col-md-12">
							<tbody>
							<tr>
								<th>
									Organization
								</th>
								<th>
									Teams
								</th>
								<th>
									Members
								</th>
								<th>
									Logo
								</th>
								<th>
									Set current
								</th>
								<th>
									Manage
								</th>
								<th>
									Delete
								</th>
							</tr>
							<tr>
								{this.renderOrganizations()}
							</tr>
							</tbody>

						</table>

						
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

function mapsStateToProps(state) {
	return {
		user: state.user.user,
		orgs: state.orgs.orgs,
	}
}

export default connect(mapsStateToProps, null)(OrgProfile);
