import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateUser } from 'src/actions';
import {
  getUserByUserId,
  getCurrentSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrg
} from 'src/selectors';

import { OrganizationManageMembers } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    orgId,
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    org: getCurrentSubscriberOrg(state)
  };
};

const mapDispatchToProps = { updateUser };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageMembers)
);
