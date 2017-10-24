import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { toggleOrgDialog,
  fetchSubscriberOrgs,
  fetchTeams, fetchTeamRooms,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog, setCurrentSubscriberOrgId
} from '../../actions';
import {
  getSubscriberOrgs,
  getCurrentSubscriberOrgId,
  getTeams,
  getTeamById,
  getTeamIdsBySubscriberOrgId,
  getTeamRooms
} from '../../selectors';
import Sidebar from '../../components/Sidebar';

function mapStateToProps(state) {
  return {
    subscriberOrgs: getSubscriberOrgs(state),
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
    teams: getTeams(state),
    teamById: getTeamById(state),
    teamIdsBySubscriberOrgId: getTeamIdsBySubscriberOrgId(state),
    teamRooms: getTeamRooms(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentSubscriberOrgId,
    toggleOrgDialog,
    fetchSubscriberOrgs,
    fetchTeams,
    toggleInvitePeopleDialog,
    fetchTeamRooms,
    toggleOrgSettingsDialog,
    toggleTeamDialog,
    toggleTeamRoomDialog }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
