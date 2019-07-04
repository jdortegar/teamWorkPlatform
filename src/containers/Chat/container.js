import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Chat } from 'src/components';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  deleteMessage,
  fetchBookmarks,
  sendTyping,
  readMessages,
  resetPagination
} from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getTeamMembersOfTeamId,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getConversationWithMessages,
  getResourcesUrl,
  getMembersTyping,
  getCurrentPagination
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, conversationId } = props;
  const orgId = getCurrentSubscriberOrgId(state);
  const [message] = state.notifications.pushMessages || [];
  let pushMessage = null;

  if (message) {
    pushMessage = message.conversationId === conversationId ? message : null;
  }

  return {
    conversation: getConversationWithMessages(state, conversationId),
    currentPagination: getCurrentPagination(state, conversationId),
    team: getTeam(state, teamId),
    currentUser: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getMembersTyping(state, conversationId),
    scrollToMessageId: props.location.state ? props.location.state.messageId : null,
    pushMessage
  };
};

const mapDispatchToProps = {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  deleteMessage,
  fetchBookmarks,
  sendTyping,
  readMessages,
  resetPagination
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
