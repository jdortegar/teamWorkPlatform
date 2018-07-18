import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamMemberPage from '../../pages/TeamMemberPage';
import {
  getCurrentSubscriberOrg,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from '../../selectors';

function mapStateToProps(state) {
  return {
    subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscriberOrg: getCurrentSubscriberOrg(state)
  };
}

function mapDispatchToProps() {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamMemberPage)
);
