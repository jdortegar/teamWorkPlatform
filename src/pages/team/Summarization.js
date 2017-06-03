import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import config from '../../config/env';
import { Header, Footer, FieldGroup } from '../../components';
import { selectTeam, inviteTeamMembers, teammembers } from '../../actions/index';
import LoggedHeader from '../../components/LoggedHeader';
import helper from '../../components/Helper';

class Summarization extends Component {

   _statusMap = {};
   _orgs = [];

   componentWillMount() {

      helper.getOrgs()
      .then(orgs => {
         this._orgs = orgs;
         this.setState({ isReady: true })
      })
      .catch(error => {
         debugger;
         console.log("getOrgs failed: " + JSON.stringify(error));
      });
      
      this.props.teams.forEach(team => {
         helper.getTeamRooms(team)
         .then(rooms => {
            team.rooms = rooms;
            this.setState({ isReady: true })
         })
         .catch(error => {
            console.log("getTeamRooms failed: " + JSON.stringify(error));
         })

         helper.getTeamMembers(team.teamId)
         .then(members => {
            team.members = members;
            this.setState({ isReady: true })
         })
         .catch(error => {
            console.log("getTeamMembers failed: " + JSON.stringify(error));
         });
      });
   }

	selectedTeam(team) {
		this.props.selectTeam(team);	
	}

   inviteTeamMembers(team) {
      // TODO: Use Redux
      // this.props.inviteTeamMembers(team);
   }

   renderTeamRooms(team) {
      if (team.rooms) {
         return team.rooms.map((room) => {
            console.log("renderTeamRooms key = " + room.roomId);
            return (
               <tr key={room.roomId}>{room.name}</tr>
            );
         });
      }
   }

   renderTeamMembers(members) {
      if (members === undefined) {
         return;
      }
      return members.map(member => {
         console.log("renderTeamMembers key = " + member.userId);
         return ( <tr key={member.userId}>{member.displayName}</tr> );
      });
   }

   submitInviteEmailToOrg(event, org) {
      const id = org.subscriberOrgId;
      const editField = `editField_${id}`;
      const ref = this.refs[editField];
      const email = ref.value;
      console.log("email = " + email);
      ref.value = "";
      event.preventDefault();

      helper.inviteSubscribersToOrg(org, [ encodeURIComponent(email) ])
      .then(response => {
         this._statusMap[id] = "Sent Invitation to " + email;
         this.setState({ isReady: true })
         setTimeout(() => {
            this._statusMap[id] = "";
            this.setState({ isReady: true })
         }, 4000);
      })
      .catch(error => {
         this._statusMap[id] = "Send failed: " + error;
         this.setState({ isReady: true })
         setTimeout(() => {
            this._statusMap[id] = "";
            this.setState({ isReady: true })
         }, 4000);
         console.log("inviteSubscribers failed: " + JSON.stringify(error));
      });
   }

   renderTeams() {
      if (this.props.teams) {
         return this.props.teams.map((team,i) => {
            const editField = `editField_${team.teamId}`;
            const statusField = `statusField_${team.teamId}`;
            const backgroundColor = (i % 2 === 0) ? '#EEE' : '#FFF';
            console.log("renderTeams key = " + team.teamId);
            return (
               <tr key={team.teamId} style={{ backgroundColor, paddingLeft: 10, paddingRight: 10 }}>
                  <td style={{ valign:"top", paddingLeft: 10 }}>
                     {team.name}
                  </td>
                  <td style={{ paddingTop: 10, paddingBottom: 20 }}>
                     {this.renderTeamMembers(team.members)}
                  </td>
                  <td style={{ paddingBottom: 50 }}>
                     <table>
                        <tbody>
                           {this.renderTeamRooms(team)}
                        </tbody>
                     </table>
                  </td>
               </tr>
            );
         });
      }
   }

   renderOrgs() {
      return this._orgs.map((org,i) => {
         const id = org.subscriberOrgId;
         const editField = `editField_${id}`;
         const statusField = `statusField_${id}`;
         const backgroundColor = (i % 2 === 0) ? '#EEE' : '#FFF';
         console.log("renderOrgs key = " + id);
         return (
            <tr key={id} style={{ backgroundColor, paddingLeft: 10, paddingRight: 10 }}>
               <td style={{ valign:"top", paddingLeft: 10 }}>
                  {org.name}
               </td>
               <td style={{ paddingTop: 10, paddingBottom: 20 }}>
                  <table>
                     <tbody>
                        {
                           org.subscribers.map((member) => {
                              console.log("org.subscribers.map key = " + member.userId);
                              return ( <tr key={member.userId}><td>{member.displayName}</td></tr> );
                           })
                        }
                        <tr style={{ height: 10 }}/>
                        <tr>
                           <td>
                              <form onSubmit={event => this.submitInviteEmailToOrg(event, org) }>
                                 <input
                                    ref={editField}
                                    type="text"
                                    placeholder="Add by Email"
                                 />
                                 <input 
                                    type="submit"
                                    value="Invite" 
                                    style={{ marginLeft: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 10 }} />
                                 <label style={{ marginLeft: 20, color: '#00F', width: 300 }} ref={statusField}>
                                    {this._statusMap[id]}
                                 </label>
                              </form>
                           </td>                               
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         );
      });
   }

	render() {
		var user = this.props.user;
		var teams = this.props.teams;
		return (
			<div>
				<LoggedHeader />
            <div style={{ align: 'center', marginLeft: 40, marginRight: 40 }}>
               <h2>Organizations</h2>
               <table>
                  <tbody>
                     <tr>
                        <th style={{ paddingLeft: 10 }}>Organization Name</th>
                        <th>Organization Members</th>
                     </tr>
                     {this.renderOrgs()}
               </tbody>
               </table>
            </div>
            <div style={{ align: 'center', marginLeft: 40, marginRight: 40 }}>
               <h2>Teams</h2>
               <table>
                  <tbody>
                     <tr>
                        <th style={{ paddingLeft: 10 }}>Team Name</th>
                        <th>Team Members</th>
                        <th>Rooms</th>
                     </tr>
                     {this.renderTeams()}
               </tbody>
               </table>
            </div>
            <div className="fill-vertical"></div>
            <div className="fill-vertical"></div>
				<Footer />
				
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.user.user,
		teams: state.teams.teams,
		rooms: state.rooms.rooms,
      token: state.token
	}
}

export default connect(mapStateToProps, {selectTeam, inviteTeamMembers})(Summarization);
