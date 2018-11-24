import { connect } from 'react-redux';
import { withStatusMessage } from 'src/hoc';
import { IntegrationPage } from 'src/pages';
import {
  getOrgIntegration,
  getOrgIntegrationContent,
  getCurrentSubscriberOrgName,
  getOrgSharingSettings,
  getCurrentSubscriberUserId,
  getCurrentSubscriberOrgId,
  getContentError,
  isFetchingContent
} from 'src/selectors';
import {
  fetchIntegrations,
  fetchIntegrationContent,
  saveOrgSharingSettings,
  toggleOrgSharingSettings,
  toggleAllOrgSharingSettings,
  integrateOrgIntegration,
  configureOrgIntegration,
  revokeOrgIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { source, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const orgId = getCurrentSubscriberOrgId(state);
  const { folders, files, sites, saved, submitting } = getOrgSharingSettings(state, { source });

  return {
    integration: getOrgIntegration(state, { source, orgId }),
    content: getOrgIntegrationContent(state, { source, subscriberUserId }),
    contentError: getContentError(state),
    isFetchingContent: isFetchingContent(state),
    orgName: getCurrentSubscriberOrgName(state),
    selectedSettings: { folders, files, sites },
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
  saveOrgSharingSettings,
  toggleOrgSharingSettings,
  toggleAllOrgSharingSettings,
  integrateOrgIntegration,
  configureOrgIntegration,
  revokeOrgIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(IntegrationPage));
