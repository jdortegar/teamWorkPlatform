import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Add from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import { toggleTeamDialog, toggleOrgDialog, toggleInviteDialog } from '../../actions';

class LeftNav extends Component {
  constructor(props) {
    super(props);

    this.state = { drawerOpen: true };
  }

  renderTeamRooms(teamId) {
    return this.props.teamRooms.reduce((acc, teamRoom) => {
      if(teamId === teamRoom.teamId) {
        acc.push(<ListItem key={teamRoom.teamRoomId} primaryText={teamRoom.name} />);
      }

      return acc;
    }, [<ListItem rightIcon={ <Add /> } key="add-team-room" primaryText="New Team Room" />]);
  }

  renderTeams(orgId) {
    return this.props.teams.reduce((acc, team) => {
      if(team.subscriberOrgId === orgId) {
        const teamRooms = this.renderTeamRooms(team.teamId);

        acc.push(<ListItem key={team.teamId} primaryText={team.name} nestedItems={teamRooms} />);
      }

      return acc;
    }, [<ListItem rightIcon={ <Add /> } key="add-team" primaryText="New Team" />]);
  }

  renderOrgs() {
    return this.props.subscriberOrgs.map((org) => {
      const teams = this.renderTeams(org.subscriberOrgId);

      return <ListItem primaryText={org.name} key={org.subscriberOrgId} primaryTogglesNestedList={true} nestedItems={teams} />;
    });
  }

  render() {
    return (
      <Drawer open={this.state.drawerOpen} containerStyle={{marginTop: "65px"}}>
        <List>
          {this.renderOrgs()}
        </List>
        <Divider />
        <List>
          <ListItem rightIcon={<Add />} primaryText="New Organization" onTouchTap={this.props.toggleOrgDialog.bind(this, true)} />
          <ListItem rightIcon={<GroupAdd />} primaryText="Invite People" onTouchTap={this.props.toggleInviteDialog.bind(this, true)} />
        </List>
      </Drawer>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    teams: state.teams.teams,
    teamRooms: state.teamRooms.teamRooms,
    subscriberOrgs: state.subscriberOrgs.data,
    currentSubscriberOrg: state.subscriberOrgs.currentSubscriberOrg
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleOrgDialog,
  toggleInviteDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
