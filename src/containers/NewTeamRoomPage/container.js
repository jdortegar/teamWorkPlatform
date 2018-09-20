import { connect } from 'react-redux';
import { createTeamRoom } from 'src/actions';
import { NewTeamRoomPage } from 'src/pages';

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTeamRoomPage);
