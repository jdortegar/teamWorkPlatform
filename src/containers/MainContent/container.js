import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  notifyMessage,
  updateInvitationDeclined,
  updateRequestResponse,
  fetchTeamsBySubscriberOrgId,
  fetchSubscriberOrgs,
  fetchPublicTeams
} from 'src/actions';
import {
  getCurrentUserId,
  getInvitations,
  getRequests,
  getDeclinedInvitations,
  getResponseRequests,
  getUserByUserId,
  getTeamsById,
  getCurrentUser,
  getConversationLink,
  getUserIdsByTeamId
} from 'src/selectors';
import { MainContent } from 'src/components';

const mapStateToProps = state => {
  const users = getUserByUserId(state);
  const currentUserId = getCurrentUserId(state);
  const [message] = state.notifications.pushMessages || [];
  let pushMessage = null;

  if (message) {
    const user = users[message.createdBy];
    const { text } = message.content.find(c => c.type === 'text/plain') || {};

    if (user && user.userId !== currentUserId) {
      pushMessage = {
        key: message.id,
        user,
        description: text,
        link: getConversationLink(state, message.conversationId)
      };
    }
  }

  return {
    declinedInvitations: getDeclinedInvitations(state),
    responseRequest: getResponseRequests(state),
    invitation: getInvitations(state),
    requests: getRequests(state),
    subscriberOrgs: state.subscriberOrgs,
    teams: getTeamsById(state),
    teamMembersByTeamId: getUserIdsByTeamId(state),
    user: getCurrentUser(state),
    users,
    pushMessage
  };
};

const mapDispatchToProps = {
  notifyMessage,
  updateInvitationDeclined,
  updateRequestResponse,
  fetchTeamsBySubscriberOrgId,
  fetchSubscriberOrgs,
  fetchPublicTeams
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
