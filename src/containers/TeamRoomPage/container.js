import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import {
  fetchTeamRoomMembersByTeamRoomId,
  fetchConversations,
  fetchTranscript,
  createMessage,
  readMessage,
  iAmTyping
} from '../../actions';
import {
  getConversationOfTeamRoomId,
  getReadMessagesOfTeamRoomId,
  getTypingsOfConversationId,
  getTeamRoomMembersOfTeamRoomId,
  getTeamRoomMembersAsObjectsOfTeamRoomId,
  getPresencesOfTeamRoomMembersOfTeamRoomId,
  getUnreadMessagesCountOfTeamRoomId
} from '../../selectors';

function mapStateToProps(state, props) {
  const teamRoomId = props.match.params.teamRoomId;
  const conversations = getConversationOfTeamRoomId(state, teamRoomId);
  const conversationId = conversations ? conversations.conversationId : null;

  return {
    user: state.auth.user,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
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
    readMessage: (messageId, conversationId) => dispatch(readMessage(messageId, conversationId)),
    iAmTyping: (conversationId, typing) => dispatch(iAmTyping(conversationId, typing))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamRoomPage));
