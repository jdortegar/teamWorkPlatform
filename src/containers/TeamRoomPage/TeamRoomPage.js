import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import { requestTeamRoomMembers } from '../../actions';

function mapStateToProps(state) {
  return {
    teamRooms: state.teamRooms,
    teamRoomMembers: state.teamRoomMembers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestTeamRoomMembers: teamRoomId => dispatch(requestTeamRoomMembers(teamRoomId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamRoomPage));
