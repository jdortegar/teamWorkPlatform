import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchSubscribersBySubscriberOrgId, setCurrentSubscriberOrgId, updateUser } from 'src/actions';
import {
  getCurrentUser,
  getUserByUserId,
  getCurrentSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from 'src/selectors';

import { OrganizationManageMembers } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    subscriberOrgs: state.subscriberOrgs,
    currentSubscriberOrgId: orgId,
    user: getCurrentUser(state),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId)
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  updateUser
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageMembers)
);
