import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Chat } from 'src/components';
import { isEmpty } from 'lodash';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchTranscript,
  createMessage,
  deleteMessage,
  saveBookmark,
  iAmTyping,
  readMessage,
  fetchMetadata
} from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getTeamMembersOfTeamId,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getConversationOfTeamId,
  getToken,
  getResourcesUrl,
  getTypingsOfConversationId,
  getUnreadMessagesCountOfTeamId,
  getConversationOfConversationId,
  getUnreadMessagesCountOfConversationId
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props;
  let conversations;
  let unreadMessagesCount;
  if (teamId) {
    conversations = getConversationOfTeamId(state, teamId);
  } else {
    conversations = getConversationOfConversationId(state);
  }
  const conversationId = !isEmpty(conversations) ? conversations.conversationId : null;
  if (teamId) {
    unreadMessagesCount = getUnreadMessagesCountOfTeamId(state, teamId);
  } else {
    unreadMessagesCount = getUnreadMessagesCountOfConversationId(state, conversationId);
  }
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    conversations,
    unreadMessagesCount,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    token: getToken(state),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getTypingsOfConversationId(state, conversationId)
  };
};

const mapDispatchToProps = {
  fetchTeamMembers,
  fetchConversations,
  fetchTranscript,
  createMessage,
  deleteMessage,
  saveBookmark,
  iAmTyping,
  readMessage,
  fetchMetadata
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
