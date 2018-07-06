import { connect } from 'react-redux';
import InviteToTeamPage from '../../pages/InviteToTeamPage';
import { inviteMembersToTeam, fetchSentInvitations } from '../../actions';
import { getCurrentUserId, getPresencesOfSubscribersOfOrgId, getSubscribersOfTeamId } from '../../selectors';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    teams: state.teams,
    currentUserId: getCurrentUserId(state),
    sentInvitations: state.sentInvitations,
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    subscribers: getSubscribersOfTeamId(state, teamId)
  };
}

function mapDispatchToProps(dispatch, props) {
  const { teamId } = props.match.params;
  return {
    fetchSentInvitations: fetchFilter => dispatch(fetchSentInvitations(fetchFilter)),
    inviteMembersToTeam: users => dispatch(inviteMembersToTeam(users, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteToTeamPage);
