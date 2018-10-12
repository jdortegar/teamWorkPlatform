import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchTeamMembersByTeamId } from 'src/actions';
import { getCurrentUser, getTeamMembersOfTeamId, getPresencesOfTeamMembersOfTeamId } from 'src/selectors';
import { TeamManagePage } from 'src/pages';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;

  return {
    user: getCurrentUser(state),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    teamMembersPresences: getPresencesOfTeamMembersOfTeamId(state, teamId)
  };
}

const mapDispatchToProps = {
  fetchTeamMembersByTeamId
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamManagePage)
);
