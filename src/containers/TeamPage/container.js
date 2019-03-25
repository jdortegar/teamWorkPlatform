import { connect } from 'react-redux';
import { getTeam, getCurrentUser, getUserRoles, getTeamFilesLoading } from 'src/selectors';
import { fetchTeamFiles, makeTeamCall } from 'src/actions';
import { TeamPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    teamId,
    team: getTeam(state, teamId),
    user: getCurrentUser(state),
    userRoles: getUserRoles(state),
    loadingFiles: getTeamFilesLoading(state, teamId)
  };
};

const mapDispatchToProps = {
  fetchTeamFiles,
  makeTeamCall
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPage);
