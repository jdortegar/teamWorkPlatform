import React, { Component, PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import countryList from 'iso-3166-country-list';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import {Footer, FieldGroup } from '../../components';
import { CountryDropdown } from 'react-country-region-selector';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { connect } from 'react-redux';
import LoggedHeader from '../../components/LoggedHeader';
import helper from '../../components/Helper';
import FileReaderInput from 'react-file-reader-input';

class ProfileEdit extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {image: "data:image/jpg;base64," + this.props.user.user.icon, file:'', notification: '', notification_color: "black"};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit (event){
		event.preventDefault();
		const names = this.state.fullName.split(' ');
		this.state["firstName"] = names[0];
		this.state["lastName"] = names[names.length-1];
		helper.updateUserProfile(this.state)
		.then(() => this.context.router.push('/profile-notify'))
		.catch(error => console.log(error))
	}
	
	componentWillMount() {
		const { country, displayName, email, timeZone, icon, firstName, lastName, preferences } = this.props.user.user;
		const fullName = firstName+' '+lastName;
		this.setState({country, displayName, email, timeZone, icon, firstName, lastName, fullName});
		helper.setUser(this.props.user);
	}

	handleChange = (value) => this.setState({timeZone: value})

	selectCountry (val) {
		const code = countryList.code(val);
		this.setState({ country: code });
	}

	handleImageChanged (event, results) {
		const file = results[0][0];
		const info = results[0][1];
		const imageType = ["image/jpeg", "image/png", "image/jpg"];
		const te = imageType.some( a => a==info.type);
		
		if (!imageType.some(type => type===info.type)) 
			this.setState({notification: "Only .jpeg .jpg .png can be uploaded", notification_color: "red"});
		else if (info.size > 50000) 
			this.setState({notification: "Image size :"+info.size+" bytes. The maximum size for image is 50KB", notification_color: "red"});
		else {
			const base64 = btoa(file.target.result);
			const encoded = 'data:image/jpeg;base64,'+ base64;
			this.props.user.user.icon = base64;
			this.setState({image: encoded, icon: base64, notification: "This image is accepted !!!", notification_color: "green"});
		}
	}

	render() {
		let imageProfile = null;
		if (this.props.user.user.icon == null) 
			imageProfile = (<div 
								className="preview-image" 
								style={{backgroundColor: this.props.user.user.preferences.iconColor, color:"white", fontSize: "70px"}}>
									{ helper.getShortName(this.props.user.user.displayName) }
							</div>)
		else {
			imageProfile = (<div>
								<img src={this.state.image} className="user-avatar-preview clearpadding" />
							</div>);
		}
		
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>

				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Your Profile </h1>
						</div>
						<div className="clearpadding">
							<p className="normal-size clearpadding">
								Your profile is viewable by members of your team
							</p>
						</div>
						<br />
						<form onSubmit={this.handleSubmit} >
							<div className="row">
								<FieldGroup
									value={this.state.fullName}
									onChange={event => this.setState({fullName: event.target.value})}
									type="text"
									placeholder="Robert J.Jones"
									label="Full Name"
									classn="col-md-12 clearpadding"
								/>
							</div>
							<div className="row">
								<FieldGroup
									value={this.state.displayName}
									onChange={event => this.setState({displayName: event.target.value})}
									type="text"
									placeholder="Bob Jones"
									label="Display Name"
									classn="col-md-12 clearpadding"
								/>
							</div>
							<div className="row">
								<FieldGroup
									defaultValue={this.state.email}
									readOnly
									type="email"
									label="Email"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<div><label>Timezone</label></div>
								<TimezonePicker
									value={this.state.timeZone}
									placeholder="Select Timezone..."
									onChange = {this.handleChange}
					
									className="col-md-12 clearpadding"
								/>
							</div>
							<div className="row form-group">
								<div className="country-selector"><label>Country</label></div>
								<CountryDropdown
									value={countryList.name(this.state.country)}
									onChange={(val) => this.selectCountry(val)}
									defaultOptionLabel="Select Country"
									classes="form-control col-md-12 clearpadding"
								/>
							</div>
							<br />
							<div>
								<div className="user-avatar-title">User Avatar</div>						
									{ imageProfile }
								<br />
								<div>
									<FileReaderInput
										as="binary"
										className="file-input"
										onChange={(event, result) => this.handleImageChanged(event,result)}
									 >
									 	<button 
											className="btn btn-large"
											type="button"
											
										>
											Select your image
										</button>
									 </FileReaderInput>
									<div style={{color: this.state.notification_color}} >
										{this.state.notification}
									</div>
								</div>
							</div>
	 						<br />
							<div className="row">
								<Button
									type="submit"
									onClick={() => this.handleSubmit}
									bsStyle="primary"
									className="col-md-12" >
										UPDATE PROFILE
								</Button>
							</div>
							<br />
							<div className="row">
								<Link to="/org-profile">
									<Button						
										className="col-md-12" >
											MANAGE YOUR ORGS
									</Button>
								</Link>
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
function mapStateToProps(state) {
	if (state.user.user != null)
	return {
		user: state.user.user
	}
}

export default connect(mapStateToProps,null)(ProfileEdit);
