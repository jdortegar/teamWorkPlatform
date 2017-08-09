import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamMemberPage from '../../pages/TeamMemberPage';
import { requestTeamRooms, requestTeamMembers } from '../../actions';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamRooms: state.teamRooms,
    teamMembers: state.teamMembers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestTeamRooms: teamId => dispatch(requestTeamRooms(teamId)),
    requestTeamMembers: teamId => dispatch(requestTeamMembers(teamId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamMemberPage));
