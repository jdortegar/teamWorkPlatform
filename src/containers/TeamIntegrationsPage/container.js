import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { TeamIntegrationsPage } from 'src/pages';
import { getTeam, getTeamIntegrations } from 'src/selectors';
import { fetchIntegrations, integrateTeamIntegration, fetchTeamIntegrations } from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    team: getTeam(state, teamId),
    integrations: getTeamIntegrations(state, teamId)
  };
};

const mapDispatchToProps = {
  fetchTeamIntegrations,
  fetchIntegrations,
  integrateTeamIntegration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamIntegrationsPage)
);
