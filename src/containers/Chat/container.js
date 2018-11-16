import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { Chat } from 'src/pages';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchTranscript,
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
  getConversationOfTeamId,
  getToken,
  getResourcesUrl,
  getTypingsOfConversationId,
  getUnreadMessagesCountOfTeamId
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  const conversations = getConversationOfTeamId(state, teamId);
  const conversationId = !isEmpty(conversations) ? conversations.conversationId : null;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    conversations,
    token: getToken(state),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getTypingsOfConversationId(state, conversationId),
    unreadMessagesCount: getUnreadMessagesCountOfTeamId(state, teamId)
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
  readMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
