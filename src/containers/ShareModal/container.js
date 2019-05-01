import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ShareModal } from 'src/components';
import { createConversation, createMessage, fetchConversations } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getOrgSubscribers,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrg,
  getOrgTeams,
  getConversationIdsByTeam
} from 'src/selectors';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    org: getCurrentSubscriberOrg(state),
    user: getCurrentUser(state),
    subscribers: getOrgSubscribers(state),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    teams: getOrgTeams(state),
    conversationIdsByTeam: getConversationIdsByTeam(state)
  };
};

const mapDispatchToProps = {
  createConversation,
  createMessage,
  fetchConversations
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ShareModal)
);
