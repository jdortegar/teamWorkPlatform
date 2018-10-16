import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTeamIntegrations, fetchTeamMembers } from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getTeamMembersOfTeamId,
  getPresencesOfTeamMembersOfTeamId,
  getTeamIntegrations,
  getCurrentSubscriberOrgId
} from 'src/selectors';
import { TeamManagePage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;

  return {
    user: getCurrentUser(state),
    team: getTeam(state, teamId),
    integrations: getTeamIntegrations(state, teamId),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    presences: getPresencesOfTeamMembersOfTeamId(state, teamId),
    orgId: getCurrentSubscriberOrgId(state)
  };
};

const mapDispatchToProps = {
  fetchTeamIntegrations,
  fetchTeamMembers
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamManagePage)
);
