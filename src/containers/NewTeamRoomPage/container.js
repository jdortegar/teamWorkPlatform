import { connect } from 'react-redux';
import NewTeamRoomPage from '../../pages/NewTeamRoomPage';
import { createTeamRoom } from '../../actions';

function mapStateToProps(state) {
  return {
    teams: state.teams,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createTeamRoom: (teamRoom, teamId) => dispatch(createTeamRoom(teamRoom, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTeamRoomPage);
