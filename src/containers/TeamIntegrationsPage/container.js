import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchIntegrations, integrateIntegration, fetchTeamIntegrations } from 'src/actions';
import { TeamIntegrationsPage } from 'src/pages';
import { getTeam, getTeamIntegrations } from 'src/selectors';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    team: getTeam(state, teamId),
    integrations: getTeamIntegrations(state, teamId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTeamIntegrations,
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    integrateIntegration: (key, subscriberOrgId, params) => dispatch(integrateIntegration(key, subscriberOrgId, params))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamIntegrationsPage)
);
