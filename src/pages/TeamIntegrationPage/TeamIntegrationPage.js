import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Switch, message } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, ImageCard, Spinner, SharingSettings } from 'src/components';
import { integrationImageFromKey, integrationLabelFromKey, integrationMapping } from 'src/utils/dataIntegrations';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
  fetchTeamIntegrations: PropTypes.func.isRequired,
  fetchIntegrationContent: PropTypes.func.isRequired,
  toggleTeamSharingSettings: PropTypes.func.isRequired,
  toggleAllTeamSharingSettings: PropTypes.func.isRequired,
  integrateTeamIntegration: PropTypes.func.isRequired,
  revokeTeamIntegration: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  integration: PropTypes.object,
  content: PropTypes.object,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool
};

const defaultProps = {
  integration: null,
  content: null,
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false,
  selectedFolders: [],
  selectedFiles: []
};

const showNotification = (response, source) => {
  const { status } = response;
  if (status === 200) {
    message.success(String.t('integrationPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationPage.message.goneDescription', { name: integrationLabelFromKey(source) }));
  } else {
    message.error(String.t('integrationPage.message.notFoundDescription'));
  }
};

class TeamIntegrationPage extends Component {
  componentDidMount() {
    const { team, source, subscriberUserId } = this.props;
    this.props.fetchTeamIntegrations(team.teamId);
    this.props.fetchIntegrationContent(source, subscriberUserId, team.teamId);
  }

  handleToggleSharingSettings = ({ folderId, fileId }) => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleTeamSharingSettings(subscriberUserId, source, team.teamId, { folderId, fileId });
  };

  handleToggleAllSharingSettings = selectAll => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleAllTeamSharingSettings(subscriberUserId, source, team.teamId, { selectAll });
  };

  handleIntegration = checked => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;
    const key = integrationMapping(source);
    if (checked) {
      integrateTeamIntegration(key, team.teamId).catch(error => message.error(error.message));
    } else {
      revokeTeamIntegration(key, integration.teamId, integration.userId)
        .then(res => showNotification(res, key))
        .catch(error => message.error(error.message));
    }
  };

  render() {
    const {
      team,
      source,
      integration,
      content,
      isFetchingContent,
      isSubmittingSharingSettings,
      isSavedSharingSettings,
      selectedFolders,
      selectedFiles
    } = this.props;
    const integrationKey = integrationMapping(source);
    const integrationImageSrc = integrationImageFromKey(integrationKey);
    const integrationLabel = integrationLabelFromKey(integrationKey);
    const statusLabel = getIntegrationStatus(integration);
    const tooltipTitle =
      statusLabel === 'Active' ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');
    const shouldDisplaySaveButton = statusLabel === 'Active' && !isFetchingContent && !isEmpty(content);
    const saveButtonOptions = shouldDisplaySaveButton
      ? {
          type: 'main',
          fitText: true,
          children: 'Save Settings',
          onClick: this.saveSharingSettings,
          loading: isSubmittingSharingSettings,
          disabled: isSavedSharingSettings || isEmpty(content)
        }
      : null;

    return (
      <div className="TeamIntegration">
        <PageHeader
          backButton={`/app/teamIntegrations/${team.teamId}`}
          pageBreadCrumb={{
            routes: [
              {
                title: team.name,
                url: `/app/team/${team.teamId}`
              },
              { title: String.t('integrationPage.integrations') }
            ]
          }}
          buttonOptions={saveButtonOptions}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="TeamIntegration__icon-container">
            <ImageCard imgSrc={integrationImageSrc} size="large" />
          </div>
          <div className="habla-big-title">{integrationLabel}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="TeamIntegration__switch-container align-center-class">
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              checkedChildren={String.t('integrationPage.on')}
              unCheckedChildren={String.t('integrationPage.off')}
              onChange={this.handleIntegration}
              checked={statusLabel === 'Active'}
            />
          </Tooltip>
        </div>
        {isFetchingContent && <Spinner />}
        {statusLabel === 'Active' &&
          !isFetchingContent &&
          content && (
            <SharingSettings
              onToggleSelect={this.handleToggleSharingSettings}
              onToggleSelectAll={this.handleToggleAllSharingSettings}
              integrationType={integrationLabel}
              folders={content.folders}
              files={content.files}
              selectedFolders={selectedFolders}
              selectedFiles={selectedFiles}
              disabled={isSavedSharingSettings || isSubmittingSharingSettings}
            />
          )}
      </div>
    );
  }
}

TeamIntegrationPage.propTypes = propTypes;
TeamIntegrationPage.defaultProps = defaultProps;

export default TeamIntegrationPage;
