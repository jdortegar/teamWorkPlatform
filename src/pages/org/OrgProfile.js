import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Modal, Header, Title, Body, Footer } from 'react-bootstrap/lib';
import { Link } from 'react-router';
import FileReaderInput from 'react-file-reader-input';
import {  FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import { connect } from 'react-redux';
import helper from '../../components/Helper';
import { selectedOrg } from '../../actions/index';

class OrgProfile extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			orgs: null, 
			orgId: [], 
			preferences: [], 
			teams: [], 
			rowClass: [], 
			subscribers:[], 
			name: [], 
			logo: [], 
			teamsNumber:[], 
			members: [], 
			current: [],
			addOrg: false,
			notification_color: "black",
			notification: '', 
			image: null,
			orgName: '',
			icon: null,
			orgWebsite: '',
		};	
		this.renderOrgs = this.renderOrgs.bind(this);
		this.closeAddOrg = this.closeAddOrg.bind(this);
		this.submitAddOrg = this.submitAddOrg.bind(this);
		this.handleOrgName = this.handleOrgName.bind(this);
		this.handleOrgWebsite = this.handleOrgWebsite.bind(this);
		this.handleImageChanged = this.handleImageChanged.bind(this);

	}

	closeAddOrg() {
		this.setState({addOrg: false});
	}

	submitAddOrg() {
		if (this.state.orgName == '') {
			this.setState({notification: "Organization Name is required !", notification_color: "red"});
		}
		else {
			
			const name = this.state.orgName;
			let preferences = {};
			preferences["webSite"] = this.state.orgWebsite;
			if (this.state.icon != null) preferences["icon"] = this.state.icon;
			console.log({name,preferences});
			helper.createSubscriberOrg({name,preferences})
			.then(response => {
				console.log(response);
				let rowClass = this.state.orgs.length % 2 == 0 ? "even" : "odd";
				this.state.orgs.push(response);
				this.state.name.push(response.name);
				const logo = response.preferences.hasOwnProperty("icon") ? (<img src={response.preferences.icon} />) : 'empty';
				this.state.logo.push(logo);
				this.state.teamsNumber.push(0);
				this.state.members.push(1);
				this.state.rowClass.push(rowClass);
				this.setState({addOrg: false});	
			})
			.catch(error => console.log(error))
			
		}
	}

	openAddOrg() {
		this.setState({addOrg: true});
	}

	handleEdit(orgData) {
		this.props.selectedOrg(orgData);
		this.context.router.push('/org-update');
	}

	handleOrgName(name) {
		this.state.orgName = name;
	}

	handleOrgWebsite(website) {
		this.state.orgWebsite = website;
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

	componentWillMount() {
		helper.setUser(this.props.user);
		helper.getOrgs()
		.then(orgs => {
			console.log(orgs);
			this.state.orgs = orgs;
			orgs.map((org,i) => {
				this.state.orgId.push(org.subscriberOrgId);
				this.state.preferences.push(org.preferences);
				const link = org.preferences.hasOwnProperty("icon") ? 'data:image/jpeg;base64,'+org.preferences.icon : '';
				const logo = org.preferences.hasOwnProperty("icon") ? (<img src={link} />) : '';
				this.state.logo.push(logo);
				let rowClass = i%2 == 0 ? "even" : "odd";
				this.state.rowClass.push(rowClass);
				const members = org.subscribers.length;
				this.state.subscribers.push(org.subscribers);
				this.state.name.push(org.name);
				this.state.members.push(members);
				this.state.current.push(true);
				helper.getTeams(org)
				.then(teams => {
					this.state.teamsNumber.push(teams.length);
					this.state.teams.push(teams);
					this.forceUpdate();
				})
				
				
			})
			
		})
	}

	renderOrgs() {
		if (this.state.orgs != null) { //this condition ensure that this function only execute the inside code when this.state.orgs already updated => solve time delay data flow
			const result = this.state.orgs.map((org,i) => {
				const rowClass = `org-table-row ${this.state.rowClass[i]}`;
				const orgData = {
					name: this.state.name[i], 
					logo: this.state.logo[i], 
					teams: this.state.teams[i], 
					members: this.state.subscribers[i],
					orgId: this.state.orgId[i],
					preferences: this.state.preferences[i],

				}
				return (
					<tr className={rowClass} key={i}>
						<td><b>{this.state.name[i]}</b></td>
						<td>{this.state.logo[i]}</td>
						<td>{this.state.teamsNumber[i]}</td>
						<td>{this.state.members[i]}</td>
						<td>
							<button className="btn color-blue">
								Set
							</button>
						</td>
						<td>
							<button 
								onClick={() => this.handleEdit(orgData)}
								className="btn color-blue" >
								Edit
							</button>
						</td>
						<td>
							<button className="btn color-blue">
								Invite Member
							</button>
						</td>
						<td>
							<button className="btn color-blue">
								Active
							</button>
						</td>
						<td>
							<button className="btn color-red">
								Delete
							</button >
						</td>
					</tr>
				);
			});
			return result;
		}
		else return;
	}

	render() {
		const organizations = this.renderOrgs();
		const country = this.state.country;
		let imageProfile = null;
		if (this.state.image == null) 
			imageProfile = (<div className="preview-image center" >
									<i className="fa fa-sitemap" />
							</div>)
		else {
			imageProfile = (<div className="center">
								<img src={this.state.image} className="user-avatar-preview clearpadding" />
							</div>);
		}
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>

				<div className="row">
					<div className="col-md-12">
						<div className="header">
							<h1> Your Organizations </h1>
						</div>
						

						<p className="normal-size center">
							Within the Hablasphere everything is organized. {'\n'}
							Here is a list of Organizations you are currently the admin for
						</p>
						
						<br />

						<table className="col-md-12 org-table">
							<tbody>
								<tr className="color-grey org-table-row">
									<th>
										Name
									</th>
									<th>
										Logo
									</th>
									<th>
										Teams
									</th>
									<th>
										Members
									</th>
									
									<th>
										Set Default
									</th>
									<th>
										Management
									</th>
									<th>
										Invitation
									</th>
									<th>
										Set Active/Inactive
									</th>
									<th>
										Delete
									</th>
								</tr>
								{organizations}
							</tbody>

						</table>
						<div className="col-md-12 center">
							<br />
							<button 
								onClick={() => this.openAddOrg()}
								className="btn btn-large center color-blue">

								ADD NEW ORGANIZATION
							</button>
						</div>
						<div className="fill-vertical">
						</div>
					</div>
				</div>
				</section>

				<Modal show={this.state.addOrg} onHide={this.closeAddOrg}>
					<Modal.Header closeButton>
						<Modal.Title className="center"> ADD NEW ORGANIZATION</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="user-avatar-title">Organization Image </div>	
									{ imageProfile }
								<br />
						<div className="center">
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
						<FieldGroup		
							type="text"
							onChange={event => this.handleOrgName(event.target.value)}
							label="Organization Name"
							placeholder="Your organization name"
							className=""
						/>
						<FieldGroup
								
							type="text"
							onChange={event => this.handleOrgWebsite(event.target.value)}
							label="Web Address"
							placeholder="www.organization.com"
							className=""
						/>
						<div className="center">
							<button 
								onClick={() => this.submitAddOrg()}
								className="btn color-blue">
								SUBMIT
							</button>
						</div>
					</Modal.Body>
	
				</Modal>

				
			</div>
		);
	}
}


function mapsStateToProps(state) {
	return {
		user: state.user.user,
		orgs: state.orgs.orgs,
	}
}

export default connect(mapsStateToProps, {selectedOrg})(OrgProfile);
