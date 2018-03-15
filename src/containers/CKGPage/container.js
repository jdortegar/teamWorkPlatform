import { connect } from 'react-redux';
import CKGPage from 'pages/CKGPage';
import {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId
} from 'actions';

const mapStateToProps = state => ({
  teamById: state.teams.teamById,
  teamRoomById: state.teamRooms.teamRoomById,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
  timeActivities: state.timeActivities
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId => dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId)),
  setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CKGPage);
