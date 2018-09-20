import { connect } from 'react-redux';
import { updateTeamRoom } from 'src/actions';
import { EditTeamRoomPage } from 'src/pages';

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
