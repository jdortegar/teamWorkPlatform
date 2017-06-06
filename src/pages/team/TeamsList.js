import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { selectTeam, teams, rooms } from '../../actions/index';
import LoggedHeader from '../../components/LoggedHeader';
import helper from '../../components/Helper';

class TeamsList extends Component {

	constructor(props) {
		super(props);
		this.teams = [];
	}
	
	selectedTeam(team) {
		this.props.selectTeam(team);
		helper.getTeamRooms(team)
		.then(rooms => {
			this.props.rooms(rooms);
			// console.log(this.props.rooms);
		})
		.catch(error => console.log("This team does not have any chat room"))	
	}

	componentWillMount() {
		helper.getTeams(this.props.org)
		.then(teams => this.props.teams(teams))
		.catch(error => console.log("This organizations does not have any team"))
	}

	render() {
		var user = this.props.user;
		var teams = this.props.teamsInOrg;
		return (
			<div>
				<LoggedHeader />
					<form>
						<div className="row">
							<div className="header">
								<h1>Teams</h1>
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
								this.props.teamsInOrg.map((team,i) => {
									return (
										<div className="col-md-8 col-md-offset-2" key={i}> {/* organizations have bug with 2 orgs have the same Id */}
											<Link 
                                    to={"/teams/"+team.name.toLowerCase()}
                                    className="col-md-4 blue-link"
                                    onClick={() => this.selectedTeam(team)}>{team.name}
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
	return {
		user: state.user.user.user,
		org: state.org.org,
		teamsInOrg: state.teams.teams
	}
}

export default connect(mapStateToProps, {selectTeam, teams, rooms})(TeamsList);
