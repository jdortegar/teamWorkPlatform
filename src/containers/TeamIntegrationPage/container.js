import { connect } from 'react-redux';
import { withStatusMessage } from 'src/hoc';
import { TeamIntegrationPage } from 'src/pages';
import { getTeam, getTeamIntegration } from 'src/selectors';
import { fetchTeamIntegrations, integrateTeamIntegration, revokeTeamIntegration } from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, source, status } = props.match.params;
  return {
    team: getTeam(state, teamId),
    integration: getTeamIntegration(state, { source, teamId }),
    source,
    status
  };
};

const mapDispatchToProps = {
  fetchTeamIntegrations,
  integrateTeamIntegration,
  revokeTeamIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(TeamIntegrationPage));
