import { connect } from 'react-redux';
import { TeamIntegrationPage } from 'src/pages';
import { getTeam, getTeamIntegration } from 'src/selectors';
import { fetchTeamIntegrations, integrateTeamIntegration, revokeIntegration } from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, source } = props.match.params;
  return {
    source,
    team: getTeam(state, teamId),
    integration: getTeamIntegration(state, { source, teamId })
  };
};

const mapDispatchToProps = {
  fetchTeamIntegrations,
  integrateTeamIntegration,
  revokeIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIntegrationPage);
