import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import axios from 'axios';
import config from '../config/env';
import { Header, Footer, FieldGroup } from '../components';
import { user, teams } from '../actions/index';
import HeaderNavbar from '../pages/homepage/components/header_navbar';

class Login extends Component {

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
    
       		axios.get(url, { headers : { Authorization: token}})
       		//Get teamroom success
       		.then(response => {
       			if (response.status == 200) {
       				
       				this.storeTeams(response.data.teams);
       				this.context.router.push('/teamroom');

       			}
       			
       		})
       		.catch(error => console.log(error))
       	}
		// this.saveToken(response.data.token);
		// this.context.router.push('/team');

      })
      .catch(error => console.log(error.status))
	}

	render() {
		return (
			<div>
			<form className="row">
                <FieldGroup
                    onChange={event => this.setState({email:event.target.value})}
                    type="text"
                    classheight="delheight"
                    placeholder="email"
                    help="&nbsp;"
                    classn="col-md-4 col-xs-12 col-sm-8 form-login"
                />

                <FieldGroup
                	onChange={event => this.setState({password:event.target.value})}
                    id="password"
                    type="Password"
                    classheight="delheight"
                    placeholder="password"
                    help={<Link to="/forgotpass" className="forgot-password">Forgot Password?</Link>}
                    classn="col-md-4 col-xs-12 col-sm-8 form-login"
                />

                <Button
                	onClick={this.logIn.bind(this)}
                    bsStyle="primary"
                    className="col-md-3 col-xs-12 col-sm-8 login-submit" >
                        Login
                </Button>
            </form>
            </div>
		);
	}
}

function mapStateToProps(state) {
	return {
		active_user: state.user.user
	};
}

export default connect(mapStateToProps, { user, teams })(Login);

