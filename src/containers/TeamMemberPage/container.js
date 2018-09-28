import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getCurrentSubscriberOrg,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from 'src/selectors';
import { TeamMemberPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscriberOrg: getCurrentSubscriberOrg(state),
    teams: state.teams
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
