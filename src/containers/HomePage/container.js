import { connect } from 'react-redux';
import { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId } from 'actions';
import HomePage from '../../pages/HomePage';

const mapStateToProps = state => ({
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  timeActivities: state.timeActivities
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId => dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId)),
  setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
