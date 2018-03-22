import { connect } from 'react-redux';
import CKGPage from 'pages/CKGPage';
import {
  getCurrentSubscriberOrgId,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getTeamRooms
} from 'selectors';
import {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId
} from 'actions';

const mapStateToProps = state => ({
  teamById: state.teams.teamById,
  teamRoomById: state.teamRooms.teamRoomById,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  timeActivities: state.timeActivities,
  teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, getCurrentSubscriberOrgId(state)),
  teamRooms: getTeamRooms(state)
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId => dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId)),
  setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CKGPage);
