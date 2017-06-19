import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import axios from 'axios';
import { Footer, FieldGroup } from '../../components';
import { user, organization, orgs, teams, rooms } from '../../actions/index';
import HeaderNavbar from '../homepage/components/header_navbar';
import helper from '../../components/Helper';

class SignIn extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {email: '', password: ''};
		this.storeUser = this.storeUser.bind(this);
		this.storeOrganization = this.storeOrganization.bind(this);
		this.storeOrgs = this.storeOrgs.bind(this);
		this.storeTeams = this.storeTeams.bind(this);
		this.storeRooms = this.storeRooms.bind(this);
		this.logIn = this.logIn.bind(this);
	}

	storeOrganization(organization) {
		this.props.organization(organization);
	}

	storeOrgs(orgs) {
      // console.log("storeOrgs count: " + orgs.length);
		this.props.orgs(orgs);
	}

	storeTeams(teams) {
      // console.log("storeTeams count: " + teams.length);
		this.props.teams(teams);
	}

	storeRooms(rooms) {
      // console.log("storeRooms count: " + rooms.length);
		this.props.rooms(rooms);
	}

	storeUser(user) {
		this.props.user(user);
	}

	logIn(event) {
		event.preventDefault();
		helper.loginAuth(this.state.email, this.state.password)
		.then(response => {
			this.setState({password: ''});  //for security
			this.storeUser(response.data);
			helper.connectWebSocket(response.data.websocketUrl);

			helper.setUser(response.data);


			helper.getOrgs()
			.then(orgs => {
				this.storeOrgs(orgs);
				this.context.router.push('/organizations');
            	// this.storeOrganization(orgs[0]);

            	// helper.getTeams(orgs[0])
            	// .then(teams => {
            	// 	console.log(teams)

             //   		this.storeTeams(teams);
             //   		helper.getTeamRooms(teams[0])
             //   		.then(rooms => {
             //   			console.log(rooms)

             //      		this.storeRooms(rooms);
             //      		this.context.router.push('/teams');
             //   		})
             //   		.catch(error => {
             //      		console.log("getTeamRooms failed: " + JSON.stringify(error));
             //   		})
            	// })
            	// .catch(error => {
             //   		console.log("getTeams failed: " + JSON.stringify(error));
            	// })
         	})
         	.catch(error => {
            	console.log("getOrgs failed: " + JSON.stringify(error));
         	})
		})
		.catch(error => console.log(error));
	}

	render() {
		return (
			<div className="container-fluid">
				<HeaderNavbar />
				<section>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<div className="header">
							<h1>
								Login
							</h1>
						</div>
						<form onSubmit={this.logIn}>
							<div className="row">
								<FieldGroup
									onChange={event => this.setState({email:event.target.value})}
									label="Email"
									type="input"
									placeholder="email"
									classn="col-md-12 clearpadding"
								/>
							</div>
							<div className="row">
								<FieldGroup
									onChange={event => this.setState({password:event.target.value})}
									label="Password"
									type="password"
									placeholder="password"
									help=""
									classn="col-md-12 clearpadding"						
								/>
							</div>
							<br />
							<div className="row">
									<Button
										bsStyle="primary"
										type="submit"
										className="col-md-12" >
											LOGIN
									</Button>
							</div>
						</form>
						<div className="row center-link">
							<Link to="/register" className="blue-link">
								NEW USER? &nbsp; SIGN UP HERE
							</Link>
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

function mapStateToProps(state) {
	return {
		active_user: state.user.user
	};
}

export default connect(mapStateToProps, { user, orgs, organization, teams, rooms })(SignIn);

