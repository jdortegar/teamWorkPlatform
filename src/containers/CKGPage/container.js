import { connect } from 'react-redux';
import CKGPage from '../../pages/CKGPage';
import { fetchTimeActivitiesBySubscriberOrgId } from '../../actions';

const mapStateToProps = state => ({
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
  timeActivities: state.timeActivities
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId => dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CKGPage);
