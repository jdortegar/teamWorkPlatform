import { connect } from 'react-redux';
import { getTeam, getCurrentSubscriberOrg, getCurrentUser, getUserRoles } from 'src/selectors';
import { fetchTeamMembers } from 'src/actions';
import { TeamPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    teamId,
    team: getTeam(state, teamId),
    org: getCurrentSubscriberOrg(state),
    user: getCurrentUser(state),
    userRoles: getUserRoles(state)
  };
};

const mapDispatchToProps = {
  fetchTeamMembers
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPage);
