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
		this.state = {orgs: null, rowClass: [], name: [], logo: [], teamsNumber:[], members: [], current: []};	
		this.renderOrgs = this.renderOrgs.bind(this);
	}

	handleChange(term) {
		this.setState({term});
	}

	componentWillMount() {
		helper.setUser(this.props.user);
		helper.getOrgs()
		.then(orgs => {
			// console.log(orgs);
			this.state.orgs = orgs;
			orgs.map((org,i) => {

				const logo = org.preferences.hasOwnProperty("icon") ? (<img src={org.preferences.icon} />) : 'empty';
				this.state.logo.push(logo);
				let rowClass = i%2 == 0 ? "even" : "odd";
				this.state.rowClass.push(rowClass);
				const members = org.subscribers.length;
				this.state.name.push(org.name);
				this.state.members.push(members);
				this.state.current.push(true);
				helper.getTeams(org)
				.then(teams => {
					this.state.teamsNumber.push(teams.length);
					this.forceUpdate();
				})
				
				
			})
			
		})
	}

	renderOrgs() {
		if (this.state.orgs != null) { //this condition ensure that this function only execute the inside code when this.state.orgs already updated => solve time delay data flow
			const result = this.state.orgs.map((org,i) => {
				return (
					<tr className={this.state.rowClass[i]} key={i}>
						<td>{this.state.name[i]}</td>
						<td>{this.state.logo[i]}</td>
						<td>{this.state.teamsNumber[i]}</td>
						<td>{this.state.members[i]}</td>
						<td>Set</td>
						<td>
							<button>
								Edit
							</button>
						</td>
						<td>
							<button>
								Delete
							</button>
						</td>
					</tr>
				);
			});
			return result;
		}
		else return;
	}

	render() {
		const organizations = this.renderOrgs();
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
								{organizations}
							</tbody>

						</table>
						<div className="col-md-12 center">
							<button className="btn btn-large center">
								ADD NEW ORGANIZATION
							</button>
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
}

function mapsStateToProps(state) {
	return {
		user: state.user.user,
		orgs: state.orgs.orgs,
	}
}

export default connect(mapsStateToProps, null)(OrgProfile);
