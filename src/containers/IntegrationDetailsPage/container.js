import { connect } from 'react-redux';
import { IntegrationDetailsPage } from 'src/pages';
import {
  getIntegration,
  getIntegrationDetails,
  getCurrentSubscriberOrgName,
  getSharingSettings,
  getCurrentSubscriberUserId
} from 'src/selectors';
import {
  fetchIntegrations,
  fetchIntegrationDetails,
  saveSharingSettings,
  toggleSharingSettings,
  toggleAllSharingSettings,
  integrateIntegration,
  configureIntegration,
  revokeIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  // TODO: make this dynamic
  const { integrationDetails: source, subscriberOrgId, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const { folders, files, submitting, saved } = getSharingSettings(state, { subscriberUserId, source });

  return {
    integration: getIntegration(state, { source, subscriberOrgId }),
    integrationDetails: getIntegrationDetails(state, { source, subscriberUserId }),
    subscriberOrgName: getCurrentSubscriberOrgName(state),
    selectedFolders: folders,
    selectedFiles: files,
    isSubmittingSharingSettings: submitting,
    isSavedSharingSettings: saved,
    subscriberUserId,
    subscriberOrgId,
    source,
    status
  };
};

const mapDispatchToProps = {
  fetchIntegrations,
  fetchIntegrationDetails,
  saveSharingSettings,
  toggleSharingSettings,
  toggleAllSharingSettings,
  integrateIntegration,
  configureIntegration,
  revokeIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntegrationDetailsPage);
