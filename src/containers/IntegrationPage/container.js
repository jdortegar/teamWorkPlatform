import { connect } from 'react-redux';
import { withStatusMessage } from 'src/hoc';
import { IntegrationPage } from 'src/pages';
import {
  getOrgIntegration,
  getOrgIntegrationContent,
  isContentFetching,
  getCurrentSubscriberOrgName,
  getOrgSharingSettings,
  getCurrentSubscriberUserId,
  getCurrentSubscriberOrgId
} from 'src/selectors';
import {
  fetchIntegrations,
  fetchIntegrationContent,
  saveSharingSettings,
  toggleSharingSettings,
  toggleAllSharingSettings,
  integrateOrgIntegration,
  configureIntegration,
  revokeOrgIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { source, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const orgId = getCurrentSubscriberOrgId(state);
  const { folders, files, saved, submitting } = getOrgSharingSettings(state, { source });

  return {
    integration: getOrgIntegration(state, { source, orgId }),
    content: getOrgIntegrationContent(state, { source, subscriberUserId }),
    subscriberOrgName: getCurrentSubscriberOrgName(state),
    isFetchingContent: isContentFetching(state),
    orgName: getCurrentSubscriberOrgName(state),
    selectedFolders: folders,
    selectedFiles: files,
    isSubmittingSharingSettings: submitting,
    isSavedSharingSettings: saved,
    subscriberUserId,
    orgId,
    source,
    status
  };
};

const mapDispatchToProps = {
  fetchIntegrations,
  fetchIntegrationContent,
  saveSharingSettings,
  toggleSharingSettings,
  toggleAllSharingSettings,
  integrateOrgIntegration,
  configureIntegration,
  revokeOrgIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(IntegrationPage));
