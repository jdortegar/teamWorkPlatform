import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { selectedOrg} from '../../actions/index';
import LoggedHeader from '../../components/LoggedHeader';
import helper from '../../components/Helper';

class OrgsList extends Component {
	
	static contextTypes = {
		router: PropTypes.object
	};


	selectedOrg(org) {
		this.props.selectedOrg(org);	
		let preferences = {};
		preferences["lastOrg"] = org.subscriberOrgId;
		helper.updateUserPreferences(preferences)
		.then(result => {
			console.log("Updated User Preferences with lastOrg !!!");
			this.context.router.push("/organizations/"+org.name.toLowerCase());
		})
		.catch(error => console.log(error))
	}

	render() {
		var user = this.props.user;
		console.log(user);
		var orgs = helper.getSort(this.props.orgs, "name");
		return (
			<div>
				<LoggedHeader />
					<form>
						<div className="row">
							<div className="header">
								<h1>Organizations</h1>
							</div>
							<FieldGroup
								type="text"
								onChange={event => this.handleChange(event.target.value)}
								placeholder="&#xf002; Search"
								classn="col-md-8 col-md-offset-2 placeholder_search"
							/>
						<div className = "row">
							<div className="col-md-4 col-md-offset-2 team-public">
								<h2>Public</h2>
								<div className="team-public-child">
								</div>
							</div>
							<div className="col-md-4 team-private odd">
								<h2>Private</h2>
								<div className="team-private-child">
								</div>
							</div>					
						</div>
							{
								orgs.map((org,i) => {
									return (
										<div className="col-md-8 col-md-offset-2" key={i}> {/* organizations have bug with 2 orgs have the same Id */}
											<Link 
                                    to={""}
                                    className="col-md-4 blue-link"
                                    onClick={() => this.selectedOrg(org)}>{org.name}
                                 </Link>
										</div>
									);
								})
							}

							<div className="fill-vertical"></div>
							<div className="fill-vertical"></div>

						</div>
					</form>

				<Footer />
				
			</div>
		);
	}
}

function mapStateToProps(state) {
	// console.log(state);
	return {
		user: state.user.user.user,
		orgs: state.orgs.orgs,
	}
}

export default connect(mapStateToProps, {selectedOrg})(OrgsList);
