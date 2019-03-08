import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Chat } from 'src/components';
import { isEmpty } from 'lodash';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
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
  getTeamConversation,
  getToken,
  getResourcesUrl,
  getMembersTyping,
  getPersonalConversation,
  getLastReadTimestampOfConversationId
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props;
  let conversation;
  if (teamId) {
    conversation = getTeamConversation(state, teamId);
  } else {
    conversation = getPersonalConversation(state);
  }
  const conversationId = !isEmpty(conversation) ? conversation.conversationId : null;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    conversation,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    token: getToken(state),
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
  readMessage,
  fetchMetadata
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
