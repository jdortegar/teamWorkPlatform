import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamPage from '../../pages/TeamPage';
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamPage));
