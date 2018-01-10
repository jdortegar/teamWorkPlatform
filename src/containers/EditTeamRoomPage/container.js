import { connect } from 'react-redux';
import EditTeamRoomPage from '../../pages/EditTeamRoomPage';
import { updateTeamRoom } from '../../actions';
import { getUrlRequestStatus, getTeamMembersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    teams: state.teams,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teamRooms: state.teamRooms,
    user: state.auth.user,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    updateTeamRoomRequestStatus: getUrlRequestStatus(state, updateTeamRoom(null, teamId, true))
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateTeamRoom: (name, teamId) => dispatch(updateTeamRoom(name, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTeamRoomPage);
