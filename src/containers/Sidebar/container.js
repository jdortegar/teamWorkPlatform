import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { Sidebar } from 'src/components';
import { setCurrentSubscriberOrgId, showSideBar } from 'src/actions';
import {
  getCurrentUser,
  getSubscriberOrgsSortedAlphabetically,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getTeamRooms,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from 'src/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
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
  return bindActionCreators(
    {
      setCurrentSubscriberOrgId,
      showSideBar
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
