import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { selectTeam, inviteTeamMembers, teammembers } from '../../actions/index';
import LogedHeader from '../../components/LogedHeader';

class Teams extends Component {
	
	selectedTeam(team) {
		this.props.selectTeam(team);	
	}

   inviteTeamMembers(team) {
      this.props.inviteTeamMembers(team);
      this.context.router.push('/teams');
   }

	render() {
		var user = this.props.user;
		var teams = this.props.teams;
		return (
			<div>
				<LogedHeader />
					<form>
						<div className="row">
							<div className="header">
								<h1>Teams</h1>
							</div>
							{
								this.props.teams.map((team,i) => {
									return (
										<div className="col-md-8 col-md-offset-2" key={Math.random()}>
											<Link 
                                    to={"/team/invite-members/"+team.name.toLowerCase()}
                                    className="col-md-4 blue-link"
                                    onClick={() => this.inviteTeamMembers()}>{team.name}
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
		teams: state.teams.teams,
		rooms: state.rooms.rooms
	}
}

export default connect(mapStateToProps, {selectTeam, inviteTeamMembers})(Teams);

 // user={this.props.user.user.displayName}

//  this.props.teams.map((team,i) => {
// 	return (
// 		<div className="col-md-8 col-md-offset-2" key={i}>
// 			<Button onClick={() => {this.chooseTeam(team)}} className="col-md-4">{team.name} </Button>
// 		</div>
// 	);
// })

