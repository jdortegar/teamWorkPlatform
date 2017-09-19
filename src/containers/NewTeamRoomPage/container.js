import { connect } from 'react-redux';
import NewTeamRoomPage from '../../pages/NewTeamRoomPage';
import { createTeamRoom } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    createTeamRoom: (name, teamId) => dispatch(createTeamRoom(name, teamId))
  };
}

export default connect(null, mapDispatchToProps)(NewTeamRoomPage);
