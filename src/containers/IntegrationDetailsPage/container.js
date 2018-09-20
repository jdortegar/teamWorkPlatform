import { connect } from 'react-redux';
import { IntegrationDetailsPage } from 'src/pages';
import { getIntegrationFilesAndFolders, getCurrentSubscriberOrgTeamsAndTeamRooms } from 'src/selectors';
import { fetchIntegrations, integrateIntegration, configureIntegration, revokeIntegration } from 'src/actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations,
    subscriberOrgs: state.subscriberOrgs,
    foldersAndFiles: getIntegrationFilesAndFolders(state),
    teams: getCurrentSubscriberOrgTeamsAndTeamRooms(state)
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
)(IntegrationDetailsPage);
