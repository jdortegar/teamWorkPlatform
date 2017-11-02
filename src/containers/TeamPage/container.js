import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamPage from '../../pages/TeamPage';
import { fetchTeamRoomsByTeamId, fetchTeamMembersByTeamId } from '../../actions';
import { getTeamRoomsOfTeamIdSortedAlphabetically, getTeamMembersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const teamId = props.match.params.teamId;

  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    teamRooms: getTeamRoomsOfTeamIdSortedAlphabetically(state, teamId),
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamRoomsByTeamId: teamId => dispatch(fetchTeamRoomsByTeamId(teamId)),
    fetchTeamMembersByTeamId: teamId => dispatch(fetchTeamMembersByTeamId(teamId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamPage));
