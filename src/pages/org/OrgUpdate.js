import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import FileReaderInput from 'react-file-reader-input';
import { connect } from 'react-redux';





class OrgUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = {term: '', image: null, notification: '', notification_color: "black"};
	}

	handleChange(term) {
		this.setState({term});

		// Todo: Implement Autocomplete function
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
		const country = this.state.country;

		let imageProfile = null;
		if (this.state.image == null) 
			imageProfile = (<div className="preview-image" >
									<i className="fa fa-sitemap" />
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
							<h1> Your Organization </h1>
						</div>

						<form>
							<div>
								<div className="user-avatar-title">Organization Image</div>	

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
											Select your organization image
										</button>
									 </FileReaderInput>
									<div style={{color: this.state.notification_color}} >
										{this.state.notification}
									</div>
								</div>
							</div>
							<br />

							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									label="Organization Name"
									placeholder="bjones_org"
									className="col-md-12"
								/>
							</div>

							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									label="Web Address"
									placeholder="www.bjones.com"
									className="col-md-12"
								/>
							</div>



	 						<br />
							<div className="row">
								<Link to="/org-notify">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											UPDATE ORG
									</Button>
								</Link>
							</div>
							<br />


							<div className="row">
								<Link to="/org-profile">
									<Button
										type="submit"
										className="col-md-12" >
											MANAGE YOUR PROFILE
									</Button>
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
	if (state.user.user != null)
	return {
		user: state.user.user
	}
}

export default connect(mapStateToProps,null)(OrgUpdate);
