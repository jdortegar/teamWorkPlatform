import { connect } from 'react-redux';
import InviteToTeamPage from '../../pages/InviteToTeamPage';
import { inviteMembersToTeam } from '../../actions';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    subscribers: state.subscribers.subscribersBySubscriberOrgId,
    teams: state.teams
  };
}

function mapDispatchToProps(dispatch, props) {
  const { teamId } = props.match.params;
  return {
    inviteMembersToTeam: users => dispatch(inviteMembersToTeam(users, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteToTeamPage);
