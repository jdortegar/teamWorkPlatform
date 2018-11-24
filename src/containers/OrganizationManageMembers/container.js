import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  fetchSubscribersBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  updateUser,
  fetchSubscription
} from 'src/actions';
import {
  getCurrentUser,
  getUserByUserId,
  getCurrentSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrg,
  getSubscription
} from 'src/selectors';

import { OrganizationManageMembers } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    subscriberOrgs: state.subscriberOrgs,
    currentSubscriberOrgId: orgId,
    user: getCurrentUser(state),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    subscriberOrg: getCurrentSubscriberOrg(state),
    subscription: getSubscription(state)
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchSubscription,
  setCurrentSubscriberOrgId,
  updateUser
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageMembers)
);
