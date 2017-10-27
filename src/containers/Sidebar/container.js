import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { toggleOrgDialog,
  fetchGlobalState,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog, setCurrentSubscriberOrgId
} from '../../actions';
import {
  getSubscriberOrgsSortedAlphabetically,
  getTeams,
  getTeamRooms } from '../../selectors';
import Sidebar from '../../components/Sidebar';

function mapStateToProps(state) {
  return {
    subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    teams: getTeams(state),
    teamById: state.teams.teamById,
    teamIdsBySubscriberOrgId: state.teams.teamIdsBySubscriberOrgId,
    teamRooms: getTeamRooms(state),
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentSubscriberOrgId,
    toggleOrgDialog,
    fetchGlobalState,
    toggleInvitePeopleDialog,
    toggleOrgSettingsDialog,
    toggleTeamDialog,
    toggleTeamRoomDialog }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
