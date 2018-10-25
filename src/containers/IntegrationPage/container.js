import { connect } from 'react-redux';
import { IntegrationPage } from 'src/pages';
import {
  getOrgIntegration,
  getOrgIntegrationContent,
  isContentFetching,
  getCurrentSubscriberOrgName,
  getSharingSettings,
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
  revokeIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { source, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const orgId = getCurrentSubscriberOrgId(state);
  const { folders, files, submitting, saved } = getSharingSettings(state, { subscriberUserId, source });

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
  revokeIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntegrationPage);
