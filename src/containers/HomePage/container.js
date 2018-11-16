import { connect } from 'react-redux';
import { getTeamsById, getCurrentSubscriberOrg, getTeamMembersOfTeamId, getCurrentUser } from 'src/selectors';
import { TeamPage } from 'src/pages';

const mapStateToProps = state => {
  const teams = getTeamsById(state);
  const org = getCurrentSubscriberOrg(state);
  const defaultTeam = Object.values(teams).find(team => team.primary === true);
  const teamId = defaultTeam ? defaultTeam.teamId : null;

  return {
    teamId,
    team: defaultTeam,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    org,
    user: getCurrentUser(state)
  };
};

export default connect(mapStateToProps)(TeamPage);
