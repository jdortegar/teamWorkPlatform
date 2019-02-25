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
  getConversationOfConversationId,
  getLastReadTimestampOfConversationId
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props;
  let conversations;
  if (teamId) {
    conversations = getConversationOfTeamId(state, teamId);
  } else {
    conversations = getConversationOfConversationId(state);
  }
  const conversationId = !isEmpty(conversations) ? conversations.conversationId : null;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    conversations,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    token: getToken(state),
    resourcesUrl: getResourcesUrl(state),
    membersTyping: getTypingsOfConversationId(state, conversationId),
    lastReadTimestamp: getLastReadTimestampOfConversationId(state, conversationId)
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
