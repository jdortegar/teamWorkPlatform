import { connect } from 'react-redux';
import InviteToTeamRoomPage from '../../pages/InviteToTeamRoomPage';
import { inviteMembersToTeamRoom } from '../../actions';
import { getSubscribersOfTeamRoomId } from '../../selectors';

function mapStateToProps(state, props) {
  const { teamRoomId } = props.match.params;
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamRooms: state.teamRooms,
    subscribers: getSubscribersOfTeamRoomId(state, teamRoomId)
  };
}

function mapDispatchToProps(dispatch, props) {
  const { teamRoomId } = props.match.params;
  return {
    inviteMembersToTeamRoom: users => dispatch(inviteMembersToTeamRoom(users, teamRoomId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteToTeamRoomPage);
