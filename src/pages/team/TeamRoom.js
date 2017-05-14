import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MessageContainer from './components/MessageContainer';
import ShortName from './components/ShortName';
import axios from 'axios';
import config from '../../config/env';
import { getPosts } from '../../actions/index';
import Perf from 'react-addons-perf';

class TeamRoom extends Component {

	render() {
		const user = this.props.user.icon == null ? ShortName(this.props.user.displayName) : "data:image/jpg;base64," + this.props.user.icon;
		
	

		// const user="SD"
		return (
			<div className="row">
				<div className="row teamroom-header-login">
					<div className="col-md-1">
						<Link to="/">
						{/*	<img className="logo-login" src='/resources/img/logo.png' /> */}
							<img className="logo-header" src='https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png' /> 
						</Link>
					</div>
					<div className="col-md-6 col-xs-12 col-md-offset-2 team-header-icons-nav">
						<div className="team-header-icon">
							<i className="fa fa-newspaper-o" />
							<div className="team-header-nav-text">
								TEAM
							</div>
						</div>
						<div className="team-header-icon">
							<i className="fa fa-bolt" />
							<div className="team-header-nav-text"> 
								CCG
							</div>
						</div>
						<div className="team-header-icon">
							<i className="fa fa-comments" />
							<div className="team-header-nav-text">
								MESSAGING
							</div>
						</div>
						<div className="team-header-icon">
							<i className="fa fa-calendar-o" />
							<div className="team-header-nav-text">
								CALENDAR
							</div>
						</div>	
					</div>

					<div className="col-md-2 col-md-offset-1 user-avatar-container">
						<div className="user-avatar">
							{this.props.user.icon == null ? 
								(<p>{user}</p>)
								:
								(<div className="user-avatar-image-text">
									<img src={user} className="user-avatar-image user-avatar-item"></img>
									<div className="user-avatar-text user-avatar-item">{this.props.user.displayName}</div>
								</div>
								)
							}
						</div>
					</div>

				</div>
				<div className="row teamroom-body-nav">
					<div className="teamroom-body-nav-links">
						<Link to="/teams" className="teamroom-body-nav-link passive">TEAM ROOMS</Link>
						<i className="fa fa-chevron-right teamroom-body-nav-link" />
						<Link to="/#" className="teamroom-body-nav-link active">{this.props.room.name.toUpperCase()}</Link>
					</div>
				</div>
				<div className="teamroom-left-nav">

				</div>
				<MessageContainer />

			</div>
		);

	}
	
} 
function mapStateToProps(state) {
	return {
		user: state.user.user.user,
		room: state.room.room
		
	}
}
export default connect(mapStateToProps,{getPosts})(TeamRoom);
// <Link to="/#" className="teamroom-body-nav-link active">LOBBY</Link>
	