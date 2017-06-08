import React, { Component, PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import countryList from 'iso-3166-country-list';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Header, Footer, FieldGroup } from '../../components';
import { CountryDropdown } from 'react-country-region-selector';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { connect } from 'react-redux';
import LoggedHeader from '../../components/LoggedHeader';
import DropzoneComponent from 'react-dropzone-component';
import helper from '../../components/Helper';



class ProfileEdit extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {image: ''};
		this.handleSubmit = this.handleSubmit.bind(this);
		// this.dropzoneConfig = {
		// 	iconFiletypes: ['.jpg','.png','.gif'],
		// 	showFiletypeIcon: true,
		// 	postUrl: 'no-url'
		// }
		// this.djsConfig = { 
		// 	dictDefaultMessage: 'Drop your avatar image here...',
		// 	autoProcessQueue: false, 
		// 	addRemoveLinks: true,
		// 	maxFilesize: 0.5,   //max filesize = 0.5MB
		// 	maxFiles: 1,
		// 	// resize: this.reducesize,
		// 	dictMaxFilesExceeded: 'Only 1 image is accepted!',
		// 	dictFileTooBig: 'Max size is 0.5MB',
		// 	dictCancelUpload: 'Cancel uploading'
		// }
		// // this.handleMaxFileExceeded = this.handleMaxFileExceeded.bind(this);
		// // this.reducesize = this.reducesize.bind(this);
		// // this.myDropzone='';

		// this.eventHandlers = {
		// 	maxfilesexceeded: () => console.log("Hello"),
		// 	maxfilesreached: () => console.log("hola"),

		// }
	}

	handleSubmit (event){
		event.preventDefault();
		// console.log(this.state);
		const names = this.state.fullName.split(' ');
		this.state["firstName"] = names[0];
		this.state["lastName"] = names[names.length-1];
		helper.updateUserProfile(this.state)
		.then(() => this.context.router.push('/profile-notify'))
		.catch(error => console.log(error))
	}

	// handleMaxFileReached() {
	// 	console.log("Maxfile reached");
	// }

	// handleMaxFileExceeded() {
	// 	console.log("Maxfile exceeded");
	// }

	// reducesize() {
	// 	console.log();
	// }

	
	componentWillMount() {
		// if (this.props.user == null) this.context.router.push('/signin'); //forward user to login
		// console.log(this.props.user);
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

	uploadImage (event) {
		event.preventDefault();
		console.log(event);
		let reader = new FileReader();
		let image = event.target.files[0];
		reader.onloadend = () => {
			this.setState({image});
			console.log(image);
			console.log(reader.result);
			this.props.user.user.icon = reader.result;
		}
	}

	render() {
		let imageProfile = null;
		if (this.props.user.user.icon == null) 
			imageProfile = (<div className="preview-image"><i className="fa fa-user" /></div>)
		else {
			const src = "data:image/jpg;base64," + this.props.user.user.icon;
			imageProfile = (<div><img src={src} className="user-avatar-preview clearpadding" /></div>);
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
								<div><input className="file-input"
									type="file"
									 />

								<button 
									className="btn btn-large"
									type="button"
									onChange={(e) => this.uploadImage(e)}
								>Upload
								</button>
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
