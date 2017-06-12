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
		this.state = {orgs: null, teamsNumber:0};	
	}

	handleChange(term) {
		this.setState({term});
	}

	componentWillMount() {
		helper.setUser(this.props.user);
		helper.getOrgs()
		.then(orgs => {
			// console.log(orgs);

			const orgRows = orgs.map((org,i) => {

				const logo = org.preferences.hasOwnProperty("icon") ? (<img src={org.preferences.icon} />) : 'empty';
				let rowClass = i%2 == 0 ? "even" : "odd";
				const members = org.subscribers.length;
				helper.getTeams(org)
				.then(teams => {
					console.log(teams.length);
					this.setState({teamsNumber: teams.length});
				})
				
				return (
					<tr className={rowClass} key={i}>
						<td>{org.name}</td>
						<td>{logo}</td>
						<td>{this.state.teamsNumber}</td>
						<td>{members}</td>
					</tr>
				);
			})
			this.setState({orgs: orgRows});
		})
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
										Logo
									</th>
									<th>
										Teams
									</th>
									<th>
										Members
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
								{this.state.orgs}
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
