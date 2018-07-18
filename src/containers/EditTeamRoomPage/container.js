import { connect } from 'react-redux';
import EditTeamRoomPage from '../../pages/EditTeamRoomPage';
import { updateTeamRoom } from '../../actions';

const mapStateToProps = state => ({
  teams: state.teams,
  teamRooms: state.teamRooms,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById
});

const mapDispatchToProps = dispatch => ({
  updateTeamRoom: (name, teamId) => dispatch(updateTeamRoom(name, teamId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeamRoomPage);
