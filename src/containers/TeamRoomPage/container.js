import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import {
  requestTeamRoomMembers,
  requestConversations,
  requestTranscript
} from '../../actions';
import {
  getConversationOfTeamRoomId,
  getTeamRoomMembersOfTeamRoomId,
  getTeamRoomMembersAsObjectsOfTeamRoomId
} from '../../selectors';

function mapStateToProps(state, props) {
  const teamRoomId = props.match.params.teamRoomId;
  // Test
  const conversation = getConversationOfTeamRoomId(state, teamRoomId);
  if ((conversation) && (conversation.transcript)) {
    console.log(`AD: transcript.length=${conversation.transcript.length}`);
  }
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
    requestTeamRoomMembers: teamRoomId => dispatch(requestTeamRoomMembers(teamRoomId)),
    requestConversations: teamRoomId => dispatch(requestConversations(teamRoomId)),
    requestTranscript: conversationId => dispatch(requestTranscript(conversationId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamRoomPage));
