import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ShareModal } from 'src/components';
import { createConversation, createMessage } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrg
} from 'src/selectors';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    org: getCurrentSubscriberOrg(state),
    user: getCurrentUser(state),
    subscribers: getSubscribersOfSubscriberOrgId(state, orgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId)
  };
};

const mapDispatchToProps = {
  createConversation,
  createMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ShareModal)
);
