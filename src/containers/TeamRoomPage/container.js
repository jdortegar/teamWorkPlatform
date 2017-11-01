import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import {
  fetchTeamRoomMembersByTeamRoomId,
  fetchConversations,
  fetchTranscript,
  createMessage
} from '../../actions';
import {
  getConversationOfTeamRoomId,
  getTeamRoomMembersOfTeamRoomId,
  getTeamRoomMembersAsObjectsOfTeamRoomId
} from '../../selectors';

function mapStateToProps(state, props) {
  const teamRoomId = props.match.params.teamRoomId;
  return {
    user: state.auth.user,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamRooms: state.teamRooms,
    conversations: getConversationOfTeamRoomId(state, teamRoomId),
    teamRoomMembers: getTeamRoomMembersOfTeamRoomId(state, teamRoomId),
    teamRoomMembersObj: getTeamRoomMembersAsObjectsOfTeamRoomId(state, teamRoomId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamRoomMembersByTeamRoomId: teamRoomId => dispatch(fetchTeamRoomMembersByTeamRoomId(teamRoomId)),
    fetchConversations: teamRoomId => dispatch(fetchConversations(teamRoomId)),
    fetchTranscript: conversationId => dispatch(fetchTranscript(conversationId)),
    createMessage: (message, conversationId) => dispatch(createMessage(message, conversationId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamRoomPage));
