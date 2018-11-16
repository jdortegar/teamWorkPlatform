import { connect } from 'react-redux';
import { getTeamsById, getCurrentSubscriberOrg } from 'src/selectors';
import { TeamPage } from 'src/pages';

const mapStateToProps = state => {
  const teams = getTeamsById(state);
  const defaultTeam = Object.values(teams).find(team => team.primary === true);
  const { teamId } = defaultTeam;

  return {
    teamId,
    team: defaultTeam,
    org: getCurrentSubscriberOrg(state)
  };
};

export default connect(mapStateToProps)(TeamPage);
