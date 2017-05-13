import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import axios from 'axios';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { user, teams, rooms } from '../../actions/index';
import HeaderNavbar from '../homepage/components/header_navbar';
import messaging from '../../actions/messaging';
import example from '../../actions/example';

class SignIn extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {email: '', password: ''};
		this.storeUser = this.storeUser.bind(this);
		this.storeTeams = this.storeTeams.bind(this);
	}

	storeTeams(teams) {
		this.props.teams(teams);
	}

	storeRooms(rooms) {
		this.props.rooms(rooms);
	}

	storeUser(user) {
		this.props.user(user);
	}

	logIn() {
		axios({
  		method: 'post',
  		url: `${config.hablaApiBaseUri}/auth/login`,
  		body: {
  			'content-type': 'application/x-www-form-urlencoded'
  		},
  		data: {
	        username: this.state.email,
	        password: this.state.password,
  		}
  	})


      .then(response => {

       	if (response.status == 200) {
       		//Login success
       		this.setState({password:''});  //for security
       		this.storeUser(response.data);
       		const token = `Bearer ${this.props.active_user.token}`;
       		const url = `${config.hablaApiBaseUri}/teams/getTeams`;
       		const urlRooms = `${config.hablaApiBaseUri}/teamRooms/getTeamRooms`;
    		//this is get teams
       		axios.get(url, { headers : { Authorization: token}})
       		//Get teamroom success
       		.then(response => {
       			if (response.status == 200) {
       				messaging(this.props.active_user.websocketUrl).connect(this.props.active_user.token)
               		.then(() => {
               			example();
               			console.log("connect successfully!");
               		});
    
       				this.storeTeams(response.data.teams);
       				// this.context.router.push('/teams');

       			}

       		})
       		.catch(error => console.log(error))

       		//this is get rooms

       		axios.get(urlRooms, { headers: { Authorization: token}})
       		.then(response => {
       			if (response.status == 200) {
       				this.storeRooms(response.data.teamRooms);
       				this.context.router.push('/teams');
       			}
       		})
       		.catch(error => console.log(error));

            // Initialize messaging.
            
       	}



      })



      .catch(error => console.log(error.status))
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
						<form>
							<div className="row">
								<FieldGroup
									onChange={event => this.setState({email:event.target.value})}
									label="Email"
									type="email"
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
										onClick={this.logIn.bind(this)}
										bsStyle="primary"
										className="col-md-12" >
											LOGIN
									</Button>

						</div>
						<div className="row center-link">
							<Link to="/register" className="blue-link">
								NEW USER? SIGN UP HERE
							</Link>
						</div>
						</form>
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

export default connect(mapStateToProps, { user, teams, rooms })(SignIn);

