import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchSubscribersBySubscriberOrgId, setCurrentSubscriberOrgId, updateUser } from 'src/actions';
import { getCurrentUser, getUserByUserId, getCurrentSubscriberOrgId } from 'src/selectors';

import { OrganizationManageMembers } from 'src/pages';

const mapStateToProps = state => ({
  subscriberOrgs: state.subscriberOrgs,
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  user: getCurrentUser(state),
  users: getUserByUserId(state)
});

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
