import { connect } from 'react-redux';
import { inviteMembersToTeamRoom, fetchSentInvitations } from 'src/actions';
import { getCurrentUserId, getPresencesOfSubscribersOfOrgId, getSubscribersOfTeamRoomId } from 'src/selectors';
import { InviteToTeamRoomPage } from 'src/pages';

function mapStateToProps(state, props) {
  const { teamRoomId } = props.match.params;
  return {
    currentUserId: getCurrentUserId(state),
    sentInvitations: state.sentInvitations,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    teams: state.teams,
    teamRooms: state.teamRooms,
    subscribers: getSubscribersOfTeamRoomId(state, teamRoomId)
  };
}

function mapDispatchToProps(dispatch, props) {
  const { teamRoomId } = props.match.params;
  return {
    fetchSentInvitations: fetchFilter => dispatch(fetchSentInvitations(fetchFilter)),
    inviteMembersToTeamRoom: users => dispatch(inviteMembersToTeamRoom(users, teamRoomId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteToTeamRoomPage);
