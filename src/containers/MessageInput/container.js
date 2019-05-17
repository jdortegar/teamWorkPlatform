import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { MessageInput } from 'src/components';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  createScheduleMessage,
  updateMessage,
  deleteMessage,
  sendTyping
} from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getTeamMembersOfTeamId,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getResourcesUrl,
  getMembersTyping,
  getConversation,
  getUserFullName
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, conversationId } = props;
  const orgId = getCurrentSubscriberOrgId(state);
  const user = getCurrentUser(state);
  const conversation = getConversation(state, conversationId);

  const currentConversationUserId = conversation.members.find(userEl => userEl.userId !== user.userId);
  const currentConversationUserFullName = getUserFullName(state, currentConversationUserId);

  return {
    orgId,
    user,
    conversationId,
    currentConversationUserFullName,
    team: getTeam(state, teamId),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getMembersTyping(state, conversationId)
  };
};

const mapDispatchToProps = {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
  createScheduleMessage,
  updateMessage,
  deleteMessage,
  sendTyping
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MessageInput)
);
