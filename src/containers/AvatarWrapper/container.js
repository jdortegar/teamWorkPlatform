import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AvatarWrapper } from 'src/components';
import { makePersonalCall } from 'src/actions';
import { getCurrentUser, getPresencesOfSubscribersOfOrgId, getCurrentSubscriberOrgId } from 'src/selectors';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    currentUser: getCurrentUser(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId)
  };
};

const mapDispatchToProps = {
  makePersonalCall
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AvatarWrapper)
);
