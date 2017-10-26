import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { toggleOrgDialog,
  fetchSubscriberOrgs,
  requestAllTeams, requestAllTeamRooms,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog, setCurrentSubscriberOrgId
} from '../../actions';
import { getSubscriberOrgsSortedAlphabetically } from '../../selectors';
import Sidebar from '../../components/Sidebar';

function mapStateToProps(state) {
  return {
    subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    teams: state.teams.raw,
    teamById: state.teams.teamById,
    teamIdsBySubscriberOrgId: state.teams.teamIdsBySubscriberOrgId,
    teamRooms: state.teamRooms.raw,
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentSubscriberOrgId,
    toggleOrgDialog,
    fetchSubscriberOrgs,
    requestAllTeams,
    toggleInvitePeopleDialog,
    requestAllTeamRooms,
    toggleOrgSettingsDialog,
    toggleTeamDialog,
    toggleTeamRoomDialog }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
