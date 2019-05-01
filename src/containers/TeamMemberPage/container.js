import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getTeamsById,
  getCurrentSubscriberOrg,
  getOrgSubscribers,
  getPresencesOfSubscribersOfOrgId
} from 'src/selectors';
import { TeamMemberPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    subscribers: getOrgSubscribers(state),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscriberOrg: getCurrentSubscriberOrg(state),
    teams: getTeamsById(state)
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
