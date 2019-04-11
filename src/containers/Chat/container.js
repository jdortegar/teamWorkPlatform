import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Chat } from 'src/components';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  deleteMessage,
  saveBookmark,
  iAmTyping,
  readMessage
} from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getTeamMembersOfTeamId,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getConversation,
  getResourcesUrl,
  getMembersTyping,
  getLastReadTimestampOfConversationId
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, conversationId } = props;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    conversation: getConversation(state, conversationId),
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getMembersTyping(state, conversationId),
    lastReadTimestamp: getLastReadTimestampOfConversationId(state, conversationId)
  };
};

const mapDispatchToProps = {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  deleteMessage,
  saveBookmark,
  iAmTyping,
  readMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
