import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamRoomPage from '../../pages/TeamRoomPage';
import { requestTeamRoomMembers } from '../../actions';
import { getConversationOfTeamRoomId } from '../../selectors';

function mapStateToProps(state, props) {
  const teamRoomId = props.match.params.teamRoomId;

  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamRooms: state.teamRooms,
    teamRoomMembers: state.teamRoomMembers,
    conversations: getConversationOfTeamRoomId(state, teamRoomId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestTeamRoomMembers: teamRoomId => dispatch(requestTeamRoomMembers(teamRoomId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamRoomPage));
