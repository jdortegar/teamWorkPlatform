import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTeamRoomsByTeamId, fetchTeamMembersByTeamId } from 'src/actions';
import {
  getCurrentUser,
  getTeamRoomsOfTeamIdSortedAlphabetically,
  getTeamMembersOfTeamId,
  getPresencesOfTeamMembersOfTeamId
} from 'src/selectors';
import { TeamPage } from 'src/pages';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;

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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamPage)
);
