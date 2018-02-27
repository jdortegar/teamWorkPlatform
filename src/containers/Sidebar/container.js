import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { toggleOrgDialog,
  fetchGlobalState,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog, setCurrentSubscriberOrgId,
  showSideBar
} from '../../actions';
import {
  getSubscriberOrgsSortedAlphabetically,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getTeamRooms,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from '../../selectors';
import Sidebar from '../../components/Sidebar';

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
    subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    teamById: state.teams.teamById,
    teamIdsBySubscriberOrgId: state.teams.teamIdsBySubscriberOrgId,
    sideBarIsHidden: state.sideBar.hidden,
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId,
    teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, state.subscriberOrgs.currentSubscriberOrgId),
    teamRooms: getTeamRooms(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentSubscriberOrgId,
    toggleOrgDialog,
    fetchGlobalState,
    showSideBar,
    toggleInvitePeopleDialog,
    toggleOrgSettingsDialog,
    toggleTeamDialog,
    toggleTeamRoomDialog }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
