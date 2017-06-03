import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { selectRoom, selectTeam, rooms } from '../../actions/index';
import LoggedHeader from '../../components/LoggedHeader';
import helper from '../../components/Helper';

class RoomsList extends Component {

	constructor(props) {
		super(props);
		this.state = {rooms : []};
	}

	componentWillMount() {
		
		helper.getTeamRooms(this.props.team)
		.then(rooms => {
			this.setState({rooms});
			
		})
		.catch(error => console.log("This team does not have any chat room"))
	}

	selectedRoom(room) {
		this.props.selectRoom(room);	
	}


	render() {

		return (
			<div>
				<LoggedHeader />
					<form>
						<div className="row">
							<div className="header">
								<h1>Team Rooms</h1>
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
								
									this.state.rooms.map((room,i) => {
									return (
										<div className="col-md-8 col-md-offset-2" key={i}>
											<Link 
                                    to={"/team/teamroom/"+room.name.toLowerCase()}
                                    className="col-md-4 blue-link"
                                    onClick={() => this.selectedRoom(room)}>{room.name}
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
		team: state.team.team
	}
}

export default connect(mapStateToProps, { selectRoom, selectTeam, rooms })(RoomsList);
