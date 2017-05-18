import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Header, Footer, FieldGroup } from '../../components';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import config from '../../config/env';
import TimezonePicker from 'react-bootstrap-timezone-picker';

class CreateAccount extends Component {

  static contextTypes = {
		router: PropTypes.object
	};

  componentWillMount() {
    this.getEmail(this.props.params.rid);
  }

  getEmail(rid) {
    var that = this;
    axios({
       method: 'get',
       url: `${config.hablaApiBaseUri}/users/validateEmail/${rid}`,
       body: {
          'content-type': 'application/json'
       }
    })
      .then((response) => {
        if (response.status === 200) {
          that.setState({email: response.data.email});
          console.log(that.state.email);
        } else {

      }
    })
       //TODO: Create a notification above register to notify if validation link is expired
       .catch((err) => this.context.router.push('/register'));
  }

	constructor(props) {
		super(props);
		this.state = {
      fullName: '',
      firstName: '',
      lastName: '',
      displayName: '',
      password:'',
      rePassword: '',
      country: '',
      timezone: '',
      icon: '' };
    this.splitFullname = this.splitFullname.bind(this);
    this.getRandomColor = this.getRandomColor.bind(this);
	}

  handleChange = (value) => this.setState({timezone: value})

	selectCountry (val) {
		this.setState({ country: val });
	}

	selectRegion (val) {
		this.setState({ region: val });
	}

  getRandomColor (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min))+min;
  }

  splitFullname(fullname) {
    var name = fullname.split(' ');
    this.state["firstName"] = name[0];
    this.state["lastName"] = name[name.length-1];
  }

	whenSubmit() {
    //---------------validation---------------
    var region = document.getElementById('info-alert');
    region.innerHTML='';
    const fullname = this.state.fullName.split(' ');
    const displayname = this.state.displayName.split(' ');
    const password = this.state.password;
    const rePassword = this.state.rePassword;
    const checkbox = this.state.checkbox;
    const country = this.state.country;
    const timezone = this.state.timezone;
    const avatar_colors = ['#e67e22','#3498db','#9b59b6',
                           '#2ecc71','#1abc9c','#f1c40f',
                           '#e67e22','#e74c3c','#7f8c8d',
                           '#e91e63','#795548','#607d8b','#2196f3'];
    var avatar_color = avatar_colors[this.getRandomColor(0, avatar_colors.length-1)];
    
    // this.state["icon"]=avatar_color;
    const notify = (text) => {
      var alertTerm = document.createElement("div");
      var text = document.createTextNode(text);
      alertTerm.appendChild(text);
      region.appendChild(alertTerm);
    };

    if (fullname.length < 2)
      notify("Full Name must have at least 2 words");
    // if (this.state.displayName == "" || displayname.length != 1)
    //   notify("Display Name must be 1 word");
    if (password.length < 6)
      notify("Password must have at least 6 characters")
    if (rePassword != this.state.password)
      notify("Confirm Password is not matched");
    if (country == "")
      notify("You must select your country");
    if (timezone == "")
      notify("You must select your timezone");
    if (!checkbox)
      notify("You must read 'term of service' and check the box");
    if (region.innerHTML == "") {
      this.splitFullname(this.state.fullName);
     
      axios({
    		method: 'post',
    		url: `${config.hablaApiBaseUri}/users/createUser`,
    		body: {
    			'content-type': 'application/json'
    		},
    		data: {
    			firstName: this.state.firstName,
          lastName: this.state.lastName,
          displayName: this.state.displayName,
          email: this.state.email,
          password: this.state.password,
          country: this.state.country,
          timeZone: this.state.timezone,
          // icon: this.state.icon
    		}
    	})
        .then(response => {
          console.log(response);
          this.context.router.push('/signin');
        })
        .catch(error => {
          console.log(error);
        });
    }
	}

	render() {
    const { country } = this.state;
		return (
			<div className="container-fluid">
				<Header user={this.state.email} />
				<section>
				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Create Account </h1>
						</div>
            <div className="info-alert" id="info-alert">
            </div>
						<div className="clearpadding">
							<h5>HI, WELCOME TO HABLA</h5>
							<p className="normal-size clearpadding"> Your email is verified and your account is almost setup,
							we just need you to complete your information below.</p>
						</div>
						<br />
						<form>
							<div className="row">
								<FieldGroup
                  onChange = {(event) => this.setState({fullName: event.target.value})}
									type="text"
									placeholder="Robert J.Jones"
									label="Full Name"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup
                  onChange = {(event) => this.setState({displayName: event.target.value})}
									type="text"
									placeholder="BobJones"
									label="Display Name"
									classn="col-md-12 clearpadding"
								/>
							</div>


							<div className="row">
								<FieldGroup
                  onChange = {(event) => this.setState({password: event.target.value})}
									type="password"
									label="Password"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup
                  onChange = {(event) => this.setState({rePassword: event.target.value})}
									type="password"
									label="Confirm Password"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row form-group">
								<div><label>Country</label></div>
								<CountryDropdown
									value={country}
									onChange={(val) => this.selectCountry(val)}
									defaultOptionLabel="Select Country"
									classes="form-control col-md-12 clearpadding"
								/>
							</div>

              <div className="row country-selector">
                <div><label>Timezone</label></div>
                <TimezonePicker
                  placeholder="Select Timezone..."
                  onChange = {this.handleChange}
                  value= {this.state.timezone}
                  className="col-md-12 clearpadding"
                />
              </div>
              <br />

							<div className="row">
	 							<Checkbox className="col-md-12 clearpadding" onChange={() => this.setState({checkbox:true})}>
	 								I have read and understand the privacy policy and <Link to="#" className="forgot-password">term of service</Link>
	 							</Checkbox>
	 						</div>
	 						<br />
							<div className="row">
									<Button
                    onClick={this.whenSubmit.bind(this)}
										bsStyle="primary"
										className="col-md-12" >
											CREATE ACCOUNT
									</Button>
							</div>
						</form>
					</div>
				</div>
				</section>
				<Footer />
			</div>
		);
	}
}

export default CreateAccount;
