import { connect } from 'react-redux';
import { inviteMembersToTeam, fetchSentInvitations } from 'src/actions';
import {
  getTeamsById,
  getCurrentUserId,
  getPresencesOfSubscribersOfOrgId,
  getSubscribersOfTeamId
} from 'src/selectors';
import { InviteToTeamPage } from 'src/pages';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    teams: getTeamsById(state),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteToTeamPage);
