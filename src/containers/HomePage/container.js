import { connect } from 'react-redux';
import { getTeamsById, getCurrentUser, getCurrentSubscriberOrgId, getTeamMembersOfTeamId } from 'src/selectors';
import { HomePage } from 'src/pages';

const mapStateToProps = state => {
  const teams = getTeamsById(state);
  const defaultTeam = Object.values(teams).find(team => team.primary === true && team.active === true);
  const teamId = defaultTeam ? defaultTeam.teamId : null;

  return {
    teamId,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    orgId: getCurrentSubscriberOrgId(state),
    user: getCurrentUser(state)
  };
};

export default connect(mapStateToProps)(HomePage);
