import React, { Component, PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { Header, Footer, FieldGroup } from '../../components';
import { CountryDropdown } from 'react-country-region-selector';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import { connect } from 'react-redux';
import LogedHeader from '../../components/LogedHeader';
import DropzoneComponent from 'react-dropzone-component';



class ProfileEdit extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = { country: 'United States', timezone:''};

		this.dropzoneConfig = {
			iconFiletypes: ['.jpg','.png','.gif'],
			showFiletypeIcon: true,
			postUrl: 'no-url'
		}
		this.djsConfig = { 
			dictDefaultMessage: 'Drop your avatar image here...',
			autoProcessQueue: false, 
			addRemoveLinks: true,
			maxFilesize: 0.5,   //max filesize = 0.5MB
			maxFiles: 1,
			// resize: this.reducesize,
			dictMaxFilesExceeded: 'Only 1 image is accepted!',
			dictFileTooBig: 'Max size is 0.5MB',
			dictCancelUpload: 'Cancel uploading'
		}
		this.handleMaxFileExceeded = this.handleMaxFileExceeded.bind(this);
		this.reducesize = this.reducesize.bind(this);
		this.myDropzone='';

		this.eventHandlers = {
			maxfilesexceeded: () => console.log("Hello"),
			maxfilesreached: () => console.log("hola"),

		}
	}

	handleMaxFileReached() {
		console.log("Maxfile reached");
	}

	handleMaxFileExceeded() {
		console.log("Maxfile exceeded");
	}

	reducesize() {
		console.log();
	}

	
	componentWillMount() {
		if (this.props.user == null) this.context.router.push('/signin'); //forward user to login
	}

	handleChange = (value) => this.setState({timezone: value})

	selectCountry (val) {
		this.setState({ country: val });
	}

	

	initCallback (dropzone) {
		console.log(dropzone);
    	myDropzone = dropzone;
	}

	removeFile () {
    	if (myDropzone) {
        	myDropzone.removeFile();
    	}
	}
	whenSubmit(event) {

	}

	

	render() {
		const country = this.state.country;
		const eventHandlers = {
			maxfilesexceeded: () => console.log("Hello"),
			maxfilesreached: () => console.log("hola"),

		}
		return (
			<div className="container-fluid">
				<LogedHeader />
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
						<form>
							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Robert J.Jones"
									label="Full Name"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Bob Jones"
									label="Display Name"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="email"
									placeholder="bob.jones@corporation.com"
									label="Email"
									classn="col-md-12 clearpadding"
								/>
							</div>

							<div className="row">
								<FieldGroup

									type="text"
									placeholder="Accounting"
									label="Department"
									classn="col-md-12 clearpadding"
								/>
							</div>



							<div className="row">
								<div><label>Timezone</label></div>
								<TimezonePicker
									defaultValue="(GMT-08:00) Pacific Time"
									placeholder="Select Timezone..."
									onChange = {this.handleChange}
									value= {this.state.timezone}
									className="col-md-12 clearpadding"
								/>
							</div>

							<div className="row form-group">
								<div className="country-selector"><label>Country</label></div>
								<CountryDropdown
									value={country}
									onChange={(val) => this.selectCountry(val)}

									defaultOptionLabel="Select Country"
									classes="form-control col-md-12 clearpadding"
								/>
							</div>
							<br />

							<div className="avatar-dropzone-container clearpadding">
								<div className="user-avatar-title">User Avatar</div>
								<DropzoneComponent config={this.dropzoneConfig}
													djsConfig={this.djsConfig}
													eventHandlers={eventHandlers}
								/>
							</div>


							{/*
							<div>
								<div className="preview-image">
									<i className="fa fa-user" />
								</div>
								<span><input className="file-input"
									type="file"
									 />

								<button className="btn btn-large"
									type="button"
									 >Upload</button>
								</span>
							</div>
							*/}

	 						<br />
							<div className="row">
								<Link to="/profile-notify">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											UPDATE PROFILE
									</Button>
								</Link>
							</div>
							<br />
							<div className="row">
								<Link to="/org-profile">
									<Button
										type="submit"
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
