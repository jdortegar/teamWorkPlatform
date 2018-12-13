import React, { Component } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { getIntegrationStatus, displayRevokeMessage } from 'src/lib/integrations';
import { IntegrationScreen } from 'src/components';

const propTypes = {
  integrateOrgIntegration: PropTypes.func.isRequired,
  revokeOrgIntegration: PropTypes.func.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  fetchIntegrationContent: PropTypes.func.isRequired,
  toggleOrgSharingSettings: PropTypes.func.isRequired,
  toggleAllOrgSharingSettings: PropTypes.func.isRequired,
  saveOrgSharingSettings: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  orgId: PropTypes.string.isRequired,
  orgName: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  integration: PropTypes.object,
  content: PropTypes.object,
  contentError: PropTypes.object,
  selectedSettings: PropTypes.object,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool
};

const defaultProps = {
  integration: null,
  content: null,
  contentError: null,
  selectedSettings: {},
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false
};

class OrgIntegrationPage extends Component {
  componentDidMount() {
    const { subscriberUserId, source } = this.props;
    this.props.fetchIntegrations();
    this.props.fetchIntegrationContent(source, subscriberUserId);
  }

  componentWillReceiveProps(nextProps) {
    const { integration, contentError } = nextProps;
    if (contentError && !this.props.contentError && getIntegrationStatus(integration) === 'Active') {
      message.error(String.t('integrationPage.message.contentError'));
    }
  }

  switchIntegration = checked => {
    const { source, integrateOrgIntegration, revokeOrgIntegration } = this.props;
    if (checked) {
      integrateOrgIntegration(source).catch(error => message.error(error.message));
    } else {
      revokeOrgIntegration(source)
        .then(res => displayRevokeMessage(res.status, source))
        .catch(error => message.error(error.message));
    }
  };

  refreshIntegration = () => {
    const { source, integrateOrgIntegration, revokeOrgIntegration } = this.props;
    revokeOrgIntegration(source)
      .then(() =>
        integrateOrgIntegration(source)
          .then(res => displayRevokeMessage(res.status, source))
          .catch(error => message.error(error.message))
      )
      .catch(error => message.error(error.message));
  };

  saveSharingSettings = () => {
    const { source, subscriberUserId } = this.props;
    this.props
      .saveOrgSharingSettings(source, subscriberUserId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  toggleSharingSettings = ({ folderId, fileId }) => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleOrgSharingSettings(subscriberUserId, source, { folderId, fileId });
  };

  toggleAllSharingSettings = selectAll => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleAllOrgSharingSettings(subscriberUserId, source, { selectAll });
  };

  render() {
    const {
      orgId,
      orgName,
      source,
      integration,
      content,
      selectedSettings,
      isFetchingContent,
      isSavedSharingSettings,
      isSubmittingSharingSettings
    } = this.props;

    return (
      <IntegrationScreen
        source={source}
        integration={integration}
        content={content}
        selectedSettings={selectedSettings}
        isFetchingContent={isFetchingContent}
        isSavedSharingSettings={isSavedSharingSettings}
        isSubmittingSharingSettings={isSubmittingSharingSettings}
        onSwitchIntegration={this.switchIntegration}
        onRefreshIntegration={this.refreshIntegration}
        onSaveSettings={this.saveSharingSettings}
        onToggleSettings={this.toggleSharingSettings}
        onToggleAllSettings={this.toggleAllSharingSettings}
        orgId={orgId}
        orgName={orgName}
      />
    );
  }
}

OrgIntegrationPage.propTypes = propTypes;
OrgIntegrationPage.defaultProps = defaultProps;

export default OrgIntegrationPage;
