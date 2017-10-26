import { connect } from 'react-redux';
import InviteToTeamPage from '../../pages/InviteToTeamPage';
import { inviteMembersToTeam } from '../../actions';
import { getSubscriberOrgById } from '../../selectors';

function mapStateToProps(state) {
  return {
    subscriberOrgById: getSubscriberOrgById(state),
    subscribers: state.subscribers.subscribersBySubscriberOrgId, // TODO: use selector
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
