import { connect } from 'react-redux';
import { getTeam, getCurrentSubscriberOrg, getTeamMembersOfTeamId, getCurrentUser } from 'src/selectors';
import { TeamPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    teamId,
    team: getTeam(state, teamId),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    org: getCurrentSubscriberOrg(state),
    user: getCurrentUser(state)
  };
};

export default connect(mapStateToProps)(TeamPage);
