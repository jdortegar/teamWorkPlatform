import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import FileReaderInput from 'react-file-reader-input';
import { connect } from 'react-redux';
import helper from '../../components/Helper';
import { Modal, Header, Title, Body, Footer } from 'react-bootstrap/lib';



class OrgUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = {
			term: '', 
			icon: '',
			image: this.props.org.link, 
			notification: '', 
			notification_color: "black",
			teams: this.props.org.teams,
			orgName: this.props.org.name,
			orgWebsite: this.props.org.preferences.webSite,

		};
		this.renderTeams = this.renderTeams.bind(this);
		this.renderMembers = this.renderMembers.bind(this);
	}

	handleEdit(teamData) {
		
	}

	componentWillMount() {
	
	}

	handleUpdateOrg() {
		const name = this.state.orgName;
		let preferences = {};
		preferences["webSite"] = this.state.orgWebsite;
		if (this.state.icon != null) preferences["icon"] = this.state.icon;
		else preferences["iconUrl"] = this.state.image;
		preferences["private"] = {};
		const data = {name, preferences};
		helper.updateSubscriberOrg(this.props.org.orgId, data)
		.then(response => {
			console.log(response);
			this.forceUpdate();
		})
		.catch(error => console.log(error))
	}

	handleOrgName(name) {
		this.state.orgName = name;
	}

	handleOrgWebsite(website) {
		this.state.orgWebsite = website;
		if (website != '' && this.state.icon == null)
			this.setState({image :'https://www.google.com/s2/favicons?domain_url='+website });
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

	renderTeams() {
		if (this.state.teams != null) { //this condition ensure that this function only execute the inside code when this.state.orgs already updated => solve time delay data flow
			const result = this.props.org.teams.map((team,i) => {
				const rowClass = "org-table-row even";//`org-table-row ${this.state.rowClass[i]}`;
				const teamData = ''//{
				// 	name: this.state.name[i], 
				// 	logo: this.state.logo[i], 
				// 	teams: this.state.teams[i], 
				// 	members: this.state.subscribers[i],
				// 	orgId: this.state.orgId[i],
				// 	preferences: this.state.prefer[i],

				// }
				return (
					<tr className={rowClass} key={i}>
						<td><b>{team.name}</b></td>
						
						<td>{this.props.org.teams.length}</td>
						<td>{10}</td>
						<td>
							<button className="btn color-blue">
								Set
							</button>
						</td>
						<td>
							<button 
								onClick={() => this.handleEdit(teamData)}
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

	renderMembers() {
		const result = this.props.org.members.map((member,i) => {
			return (
				<tr className="org-table-row" key={i}>
					<td>
						<b>{member.displayName}</b>
					</td>
					<td>
						abc@cde.com
					</td>
					<td>
						Not set yet
					</td>
					<td>
						Joined
					</td>
					<td>
						3
					</td>
					<td>
						5
					</td>
					<td>
						<button className="btn color-blue">
							View
						</button>
					</td>
					<td>
						<button className="btn color-red">
							Remove
						</button>
					</td>
				</tr>
			)
		})
		return result;
	}



	render() {
	
		const country = this.state.country;
		const teams = this.renderTeams();
		const members = this.renderMembers();
		let imageProfile = null;

		// if (this.state.image == null) 
		// 	imageProfile = (<div className="preview-image center" >
		// 							<i className="fa fa-sitemap" />
		// 					</div>)
		// else {
		// 	imageProfile = (<div>
		// 						<img src={this.state.image} className="user-avatar-preview clearpadding" />
		// 					</div>);
		// }
		imageProfile = (<div><img src={this.state.image} className="user-avatar-preview clearpadding" /></div>);
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>
				<div className="row">
					<div className="col-md-12 center ">
						<div className="header">
							<h1> {this.state.orgName} </h1>
						</div>

						<form>
							<div className="col-md-6">
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
							<div className="col-md-4">
								<FieldGroup
									
									type="text"
									onChange={event => this.handleOrgName(event.target.value)}
									label="Organization Name"
									placeholder={this.state.orgName}
									className="col-md-12"
								/>


							</div>

							<div className="col-md-4">
								<FieldGroup
								
									type="text"
									onChange={event => this.handleOrgWebsite(event.target.value)}
									label="Web Address"
									placeholder={this.state.orgWebsite}
									className="col-md-12"
								/>
							</div>



	 						<br />
							<div className="col-md-4">
								<br />
								
								<Button
									onClick={() => this.handleUpdateOrg()}
									bsStyle="primary"
									className="col-md-12" >
										UPDATE ORGANIZATION
								</Button>
							
							</div>
							<br />
						</form>
						<div className="clearfix"></div>
						<div className = "row">
							<div className="col-md-2">
								<h3> TEAMS </h3>
							</div>
							<table className="col-md-12 org-table">
								<tbody>
									<tr className="color-grey org-table-row">
										<th>
											Name
										</th>
										<th>
											Members
										</th>
										<th>
											Team Rooms
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
									{teams}
								</tbody>

							</table>
						</div>
						<div className="col-md-12 center">
							<br />
							<button className="btn btn-large center color-blue">
								ADD NEW TEAM
							</button>
						</div>
						<br />
						<br />
						<div className = "row">
							<div className="col-md-2">
								<h3> MEMBERS </h3>
							</div>
							<table className="col-md-12 org-table">
								<tbody>
									<tr className="color-grey org-table-row">
										<th>
											Name
										</th>
										<th>
											Email
										</th>
										<th>
											Avatar
										</th>
										<th>
											Status
										</th>
										<th>
											Joined Teams
										</th>
										<th>
											Joined Team Rooms
										</th>				
										<th>
											Detail
										</th>
										<th>
											Kick out
										</th>
									</tr>
									{members}
								</tbody>

							</table>
						</div>
						<div className="col-md-12 center">
							<br />
							<button className="btn btn-large center color-blue">
								INVITE NEW MEMBER
							</button>
						</div>
					</div>
				</div>
				</section>
				
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user,
		org: state.org.org
	}
}

export default connect(mapStateToProps,null)(OrgUpdate);
