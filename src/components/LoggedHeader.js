import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import helper from './Helper';
import { DropdownButton, MenuItem } from 'react-bootstrap/lib';
import { LinkContainer } from 'react-router-bootstrap';

class LogedHeader extends Component {
	static contextTypes = {
		router: PropTypes.object
	}
	componentWillMount() {
		if (this.props.user == null) this.context.router.push('/signin');
	}

	logout() {
		
	}

	render() {
		const iconWidth = "30px";
		const user = this.props.user.icon == null ? helper.getShortName(this.props.user.displayName) : "data:image/jpg;base64," + this.props.user.icon;
		return (
			<div className="row">
				<div className="row teamroom-header-login">
					<div className="col-md-3">
						<Link to="/">
							<img className="logo-header" src='https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png' /> 
						</Link>
					</div>
					<div className="col-md-6 team-header-icons-nav">
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

					<div className="col-md-3 user-avatar-container">
						<div className="user-avatar">
							<div className="user-avatar-image-text">
									
									<DropdownButton 
								      id="avatar-dropdown"
								      title={this.props.user.icon == null ? 
								      	(<div className="user-avatar-image user-avatar-item" style={{backgroundColor: this.props.user.preferences.iconColor, borderRadius: "5px", width: "30px", height: "30px", color: "white", fontWeight: "bold", fontSize: "14px"}}>
												<p>{user}</p>
												
										</div>
										)
								        :(<img src={user} className="user-avatar-image user-avatar-item" data-toggle="dropdown"></img>)
								      }

								      noCaret
								      className="avatar-button clearpadding"
								    >
								      <LinkContainer to="/profile-edit"><MenuItem eventKey='1'><i className="fa fa-envelope fa-fw" style={{width: iconWidth, textAlign: "left"}}></i> User Profile</MenuItem></LinkContainer>
								      <LinkContainer to="/org-profile"><MenuItem eventKey='2'><i className="fa fa-sitemap" style={{width: iconWidth, textAlign: "left"}}></i> Your Organizations</MenuItem></LinkContainer>
								      <LinkContainer to="/summarization"><MenuItem eventKey='3'><i className="fa fa-snowflake-o" style={{width: iconWidth, textAlign: "left"}}></i> Summarization</MenuItem></LinkContainer>
								      <MenuItem eventKey='3'><i className="fa fa-gear fa-fw" style={{width: iconWidth, textAlign: "left"}}></i> Settings</MenuItem>
								      <MenuItem divider />
								      <MenuItem eventKey='4' onClick={() => this.logout} ><i className="fa fa-sign-out fa-fw" style={{width: iconWidth, textAlign: "left"}}></i> Logout</MenuItem>
								    </DropdownButton>






									<div className="user-avatar-text user-avatar-item">{this.props.user.displayName}</div>
							</div>






						</div>
					</div>

				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	if (state.user.user != null) {
		return {
			user: state.user.user.user
		}
	}
	else return {
		user: state.user.user
	}
}

export default connect(mapStateToProps, null)(LogedHeader);
