import { connect } from 'react-redux';
import { getTeamsById } from 'src/selectors';
import { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId } from 'src/actions';
import { TeamPageV1 } from 'src/pages';

const mapStateToProps = state => ({
  currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  teams: getTeamsById(state)
});

const mapDispatchToProps = dispatch => ({
  fetchTimeActivitiesBySubscriberOrgId: subscriberOrgId =>
    dispatch(fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId)),
  setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPageV1);
