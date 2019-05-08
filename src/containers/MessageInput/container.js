import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { MessageInput } from 'src/components';

import {
  fetchTeamMembers,
  fetchConversations,
  fetchMessages,
  createMessage,
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
  getMembersTyping
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, conversationId } = props;
  const orgId = getCurrentSubscriberOrgId(state);

  return {
    orgId,
    conversationId,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
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
