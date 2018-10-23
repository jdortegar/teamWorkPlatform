import { connect } from 'react-redux';
import { TeamIntegrationPage } from 'src/pages';
import { getTeamsById, getTeamIntegrations } from 'src/selectors';
import { fetchIntegrations, integrateIntegration, configureIntegration, revokeIntegration } from 'src/actions';

function mapStateToProps(state, props) {
  const { teamId } = props.match.params;
  return {
    integrations: getTeamIntegrations(state, teamId),
    subscriberOrgs: state.subscriberOrgs,
    teams: getTeamsById(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    integrateIntegration: (key, subscriberOrgId, params) =>
      dispatch(integrateIntegration(key, subscriberOrgId, params)),
    configureIntegration: (key, subscriberOrgId, configuration) =>
      dispatch(configureIntegration(key, subscriberOrgId, configuration)),
    revokeIntegration: (key, subscriberOrgId) => dispatch(revokeIntegration(key, subscriberOrgId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamIntegrationPage);
