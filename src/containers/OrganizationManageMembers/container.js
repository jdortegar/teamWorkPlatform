import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchSubscribersBySubscriberOrgId, setCurrentSubscriberOrgId } from 'src/actions';
import {
  getCurrentUser,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrgId
} from 'src/selectors';

import { OrganizationManageMembers } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { subscriberOrgId } = props.match.params;
  return {
    subscriberOrgs: state.subscriberOrgs,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
    user: getCurrentUser(state),
    subscribers: getSubscribersOfSubscriberOrgId(state, subscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId)
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  setCurrentSubscriberOrgId
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageMembers)
);
