import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTeamIntegrations, fetchTeamMembers } from 'src/actions';
import {
  getTeam,
  getCurrentUser,
  getTeamMembersOfTeamId,
  getPresencesOfTeamMembersOfTeamId,
  getTeamIntegrations,
  getCurrentSubscriberOrgId,
  getUserFullName,
  getUserByUserId
} from 'src/selectors';
import { TeamManagePage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  const team = getTeam(state, teamId);

  return {
    team,
    user: getCurrentUser(state),
    users: getUserByUserId(state),
    teamAdminName: getUserFullName(state, team && team.teamAdmin),
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
