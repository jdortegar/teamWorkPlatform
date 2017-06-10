import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Footer, FieldGroup } from '../../components';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import countryList from 'iso-3166-country-list';
import config from '../../config/env';
import helper from '../../components/Helper';
import TimezonePicker from 'react-bootstrap-timezone-picker';

class CreateAccount extends Component {

  static contextTypes = {
		router: PropTypes.object
	};

  componentWillMount() {
    this.getEmail(this.props.params.rid);
  }

  getEmail(rid) {
    helper.validateEmail(rid)
    .then(response => {
      this.setState({email: response.data.email});
    })
    .catch(error => this.context.router.push('/register'));
    //TODO: Create a notification above register to notify if validation link is expired
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
      timeZone: '',
      icon: '' };
    this.splitFullname = this.splitFullname.bind(this);

	}

  handleChange = (value) => this.setState({timeZone: value})

	selectCountry (val) {
		this.setState({ country: countryList.code(val) });
	}

	selectRegion (val) {
		this.setState({ region: val });
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
    const {firstName, lastName, displayName, email, password, rePassword, country, timezone, checkbox, fullName} = this.state;
    const notify = (text) => {
      var alertTerm = document.createElement("div");
      var text = document.createTextNode(text);
      alertTerm.appendChild(text);
      region.appendChild(alertTerm);
    };

    if (fullName.split(' ').length < 2)
      notify("Full Name must have at least 2 words");
    else { 
      this.splitFullname(fullName);
    }
    // if (this.state.displayName == "" || displayname.length != 1)
    //   notify("Display Name must be 1 word");
    // if (password.length < 6)
    //   notify("Password must have at least 6 characters")
    if (rePassword != password)
      notify("Confirm Password is not matched");
    if (country == "")
      notify("You must select your country");
    if (timezone == "")
      notify("You must select your timezone");
    if (!checkbox)
      notify("You must read 'term of service' and check the box");

    if (region.innerHTML == "") {
      helper.createUser(this.state)
      .then(() => this.context.router.push('/signin'))
      .catch(error => console.log(error))
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
									placeholder="Bob Jones"
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
                  value= {this.state.timeZone}
                  className="col-md-12 clearpadding"
                />
              </div>
              <br />

							<div className="row">
	 							<Checkbox className="col-md-12 clearpadding" onChange={() => this.setState({checkbox:true})}>
	 								I have read and understand the privacy policy and <Link to="/terms-of-service" className="forgot-password" target="_blank">term of service</Link>
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
