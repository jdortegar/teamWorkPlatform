import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import { connect } from 'react-redux';
import helper from '../../components/Helper';
import { selectedOrg } from '../../actions/index';

class OrgProfile extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {orgs: null, orgId: [], prefer: [], teams: [], rowClass: [], subscribers:[], name: [], logo: [], teamsNumber:[], members: [], current: []};	
		this.renderOrgs = this.renderOrgs.bind(this);
	}

	handleChange(term) {
		this.setState({term});
	}

	handleEdit(orgData) {
		this.props.selectedOrg(orgData);
		this.context.router.push('/org-update');
	}

	componentWillMount() {
		helper.setUser(this.props.user);
		helper.getOrgs()
		.then(orgs => {
			// console.log(orgs);
			this.state.orgs = orgs;
			orgs.map((org,i) => {
				this.state.orgId.push(org.subscriberOrgId);
				this.state.prefer.push(org.preferences);
				const logo = org.preferences.hasOwnProperty("icon") ? (<img src={org.preferences.icon} />) : 'empty';
				this.state.logo.push(logo);
				let rowClass = i%2 == 0 ? "even" : "odd";
				this.state.rowClass.push(rowClass);
				const members = org.subscribers.length;
				this.state.subscribers.push(org.subscribers);
				this.state.name.push(org.name);
				this.state.members.push(members);
				this.state.current.push(true);
				helper.getTeams(org)
				.then(teams => {
					this.state.teamsNumber.push(teams.length);
					this.state.teams.push(teams);
					this.forceUpdate();
				})
				
				
			})
			
		})
	}

	renderOrgs() {
		if (this.state.orgs != null) { //this condition ensure that this function only execute the inside code when this.state.orgs already updated => solve time delay data flow
			const result = this.state.orgs.map((org,i) => {
				const rowClass = `org-table-row ${this.state.rowClass[i]}`;
				const orgData = {
					name: this.state.name[i], 
					logo: this.state.logo[i], 
					teams: this.state.teams[i], 
					members: this.state.subscribers[i],
					orgId: this.state.orgId[i],
					preferences: this.state.prefer[i],

				}
				return (
					<tr className={rowClass} key={i}>
						<td><b>{this.state.name[i]}</b></td>
						<td>{this.state.logo[i]}</td>
						<td>{this.state.teamsNumber[i]}</td>
						<td>{this.state.members[i]}</td>
						<td>
							<button className="btn color-blue">
								Set
							</button>
						</td>
						<td>
							<button 
								onClick={() => this.handleEdit(orgData)}
								className="btn color-blue" >
								Edit
							</button>
						</td>
						<td>
							<button className="btn color-green">
								Invite Member
							</button>
						</td>
						<td>
							<button className="btn color-yellow">
								Active
							</button>
						</td>
						<td>
							<button className="btn color-red">
								Delete
							</button >
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

						<table className="col-md-12 org-table">
							<tbody>
								<tr className="color-blue org-table-row">
									<th>
										Name
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
										Set Default
									</th>
									<th>
										Management
									</th>
									<th>
										Invitation
									</th>
									<th>
										Set Active/Inactive
									</th>
									<th>
										Delete
									</th>
								</tr>
								{organizations}
							</tbody>

						</table>
						<div className="col-md-12 center">
							<br />
							<button className="btn btn-large center color-blue">
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

export default connect(mapsStateToProps, {selectedOrg})(OrgProfile);
