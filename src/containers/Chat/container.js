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
  readMessages
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
  getMembersTyping
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, conversationId } = props;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    conversation: getConversationWithMessages(state, conversationId),
    team: getTeam(state, teamId),
    currentUser: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getMembersTyping(state, conversationId),
    scrollToMessageId: props.location.state ? props.location.state.messageId : null
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
  readMessages
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
