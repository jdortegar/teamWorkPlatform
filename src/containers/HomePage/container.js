import { connect } from 'react-redux';
import { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId } from 'src/actions';
import { HomePage } from 'src/pages';

const mapStateToProps = state => ({
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId =>
    dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId)),
  setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
