import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamPage from '../../pages/TeamPage';
import { fetchTeamRoomsByTeamId, fetchTeamMembersByTeamId } from '../../actions';
import {
  getCurrentUser,
  getTeamRoomsOfTeamIdSortedAlphabetically,
  getTeamMembersOfTeamId,
  getPresencesOfTeamMembersOfTeamId
} from '../../selectors';

function mapStateToProps(state, props) {
  const teamId = props.match.params.teamId;

  return {
    user: getCurrentUser(state),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    teamMembersPresences: getPresencesOfTeamMembersOfTeamId(state, teamId),
    teamRooms: getTeamRoomsOfTeamIdSortedAlphabetically(state, teamId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamRoomsByTeamId: teamId => dispatch(fetchTeamRoomsByTeamId(teamId)),
    fetchTeamMembersByTeamId: teamId => dispatch(fetchTeamMembersByTeamId(teamId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamPage));
