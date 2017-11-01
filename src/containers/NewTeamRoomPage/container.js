import { connect } from 'react-redux';
import NewTeamRoomPage from '../../pages/NewTeamRoomPage';
import { createTeamRoom } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    createTeamRoom: (teamRoom, teamId) => dispatch(createTeamRoom(teamRoom, teamId))
  };
}

export default connect(null, mapDispatchToProps)(NewTeamRoomPage);
