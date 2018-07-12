import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import {
  fetchTeamRoomMembersByTeamRoomId,
  fetchConversations,
  fetchTranscript,
  createMessage,
  deleteMessage,
  saveBookmark,
  readMessage,
  iAmTyping
} from '../../actions';
import {
  getToken,
  getCurrentUser,
  getResourcesUrl,
  getConversationOfTeamRoomId,
  getSubscribersOfSubscriberOrgId,
  getReadMessagesOfTeamRoomId,
  getTypingsOfConversationId,
  getTeamRoomMembersOfTeamRoomId,
  getTeamRoomMembersAsObjectsOfTeamRoomId,
  getPresencesOfTeamRoomMembersOfTeamRoomId,
  getUnreadMessagesCountOfTeamRoomId
} from '../../selectors';

function mapStateToProps(state, props) {
  const { teamRoomId } = props.match.params;
  const conversations = getConversationOfTeamRoomId(state, teamRoomId);
  const conversationId = conversations ? conversations.conversationId : null;

  return {
    user: getCurrentUser(state),
    resourcesUrl: getResourcesUrl(state),
    token: getToken(state),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    teams: state.teams,
    teamRooms: state.teamRooms,
    conversations,
    readMessages: getReadMessagesOfTeamRoomId(state, teamRoomId),
    unreadMessagesCount: getUnreadMessagesCountOfTeamRoomId(state, teamRoomId),
    membersTyping: getTypingsOfConversationId(state, conversationId),
    teamRoomMembers: getTeamRoomMembersOfTeamRoomId(state, teamRoomId),
    teamRoomMembersObj: getTeamRoomMembersAsObjectsOfTeamRoomId(state, teamRoomId),
    teamRoomMembersPresences: getPresencesOfTeamRoomMembersOfTeamRoomId(state, teamRoomId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamRoomMembersByTeamRoomId: teamRoomId => dispatch(fetchTeamRoomMembersByTeamRoomId(teamRoomId)),
    fetchConversations: teamRoomId => dispatch(fetchConversations(teamRoomId)),
    fetchTranscript: conversationId => dispatch(fetchTranscript(conversationId)),
    createMessage: (message, conversationId) => dispatch(createMessage(message, conversationId)),
    deleteMessage: (message, conversationId) => dispatch(deleteMessage(message, conversationId)),
    saveBookmark: (user, subscriberOrgId, message, setBookmark) =>
      dispatch(saveBookmark(user, subscriberOrgId, message, setBookmark)),
    readMessage: (messageId, conversationId) => dispatch(readMessage(messageId, conversationId)),
    iAmTyping: (conversationId, typing) => dispatch(iAmTyping(conversationId, typing))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamRoomPage)
);
