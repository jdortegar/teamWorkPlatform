import { connect } from 'react-redux';
import InviteToTeamPage from '../../pages/InviteToTeamPage';
import { inviteMembersToTeam } from '../../actions';
import { getSubscribersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    teams: state.teams,
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    subscribers: getSubscribersOfTeamId(state, teamId)
  };
}

function mapDispatchToProps(dispatch, props) {
  const { teamId } = props.match.params;
  return {
    inviteMembersToTeam: users => dispatch(inviteMembersToTeam(users, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteToTeamPage);
