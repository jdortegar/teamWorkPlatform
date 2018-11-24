import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { TeamRoomPage } from 'src/pages';
import {
  fetchConversations,
  fetchTranscript,
  createMessage,
  deleteMessage,
  saveBookmark,
  readMessage,
  iAmTyping
} from 'src/actions';
import {
  getToken,
  getCurrentUser,
  getResourcesUrl,
  getConversationOfTeamRoomId,
  getSubscribersOfSubscriberOrgId,
  getReadMessagesOfTeamRoomId,
  getTypingsOfConversationId,
  getUnreadMessagesCountOfTeamRoomId
} from 'src/selectors';

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
    membersTyping: getTypingsOfConversationId(state, conversationId)
    // teamRoomMembers: getTeamRoomMembersOfTeamRoomId(state, teamRoomId),
    // teamRoomMembersObj: getTeamRoomMembersAsObjectsOfTeamRoomId(state, teamRoomId),
    // teamRoomMembersPresences: getPresencesOfTeamRoomMembersOfTeamRoomId(state, teamRoomId)
  };
}

const mapDispatchToProps = {
  fetchConversations,
  fetchTranscript,
  createMessage,
  deleteMessage,
  saveBookmark,
  readMessage,
  iAmTyping
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamRoomPage)
);
