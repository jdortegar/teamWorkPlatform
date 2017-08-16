import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamPage from '../../pages/TeamPage';
import { requestTeamRooms, requestTeamMembers } from '../../actions';
import { getTeamRoomsOfTeamId, getTeamMembersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const teamId = props.match.params.teamId;

  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    teamRooms: getTeamRoomsOfTeamId(state, teamId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestTeamRooms: teamId => dispatch(requestTeamRooms(teamId)),
    requestTeamMembers: teamId => dispatch(requestTeamMembers(teamId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamPage));
