import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Switch, message } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import { integrationImageFromKey, integrationLabelFromKey } from 'src/utils/dataIntegrations';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
  fetchTeamIntegrations: PropTypes.func.isRequired,
  fetchIntegrationContent: PropTypes.func.isRequired,
  toggleTeamSharingSettings: PropTypes.func.isRequired,
  toggleAllTeamSharingSettings: PropTypes.func.isRequired,
  saveTeamSharingSettings: PropTypes.func.isRequired,
  integrateTeamIntegration: PropTypes.func.isRequired,
  revokeTeamIntegration: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  integration: PropTypes.object,
  content: PropTypes.object,
  contentError: PropTypes.object,
  selectedSettings: PropTypes.object,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool,
  subscriberUserEmail: PropTypes.email
};

const defaultProps = {
  integration: null,
  content: null,
  contentError: null,
  selectedSettings: {},
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false,
  subscriberUserEmail: ''
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

  componentWillReceiveProps(nextProps) {
    const { integration, contentError } = nextProps;
    if (contentError && !this.props.contentError && getIntegrationStatus(integration) === 'Active') {
      message.error(String.t('integrationPage.message.contentError'));
    }
  }

  saveSharingSettings = () => {
    const { source, subscriberUserId, team } = this.props;
    this.props
      .saveTeamSharingSettings(source, subscriberUserId, team.teamId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  handleFieldChange = (key, event) => {
    this.setState({ fields: { ...this.state.fields, [key]: event.target.value } });
  };

  handleToggleSharingSettings = ({ folderId, fileId, site }) => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleTeamSharingSettings(subscriberUserId, source, team.teamId, { folderId, fileId, site });
  };

  handleToggleAllSharingSettings = selectAll => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleAllTeamSharingSettings(subscriberUserId, source, team.teamId, { selectAll });
  };

  handleIntegration = checked => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;
    if (checked) {
      integrateTeamIntegration(source, team.teamId).catch(error => message.error(error.message));
    } else {
      revokeTeamIntegration(source, integration.teamId, integration.userId)
        .then(res => showNotification(res, source))
        .catch(error => message.error(error.message));
    }
  };

  refreshIntegration = () => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;

    revokeTeamIntegration(source, integration.teamId, integration.userId)
      .then(
        integrateTeamIntegration(source, team.teamId)
          .then(res => showNotification(res, source))
          .catch(error => message.error(error.message))
      )
      .catch(error => message.error(error.message));
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
      selectedSettings,
      subscriberUserEmail
    } = this.props;
    const integrationImageSrc = integrationImageFromKey(source);
    const integrationLabel = integrationLabelFromKey(source);
    const statusLabel = getIntegrationStatus(integration);
    const integrationEmailLabel =
      statusLabel === 'Active' ? subscriberUserEmail : String.t('integrationPage.deactivate');
    const tooltipTitle =
      statusLabel === 'Active' ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');
    const displaySharingSettings = statusLabel === 'Active' && !isFetchingContent && !isEmpty(content);
    const saveButtonOptions = displaySharingSettings
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
          backButton
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
          <div className="habla-secondary-paragraph margin-top-class-b">{integrationEmailLabel}</div>
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
        {statusLabel === 'Active' && (
          <div className="TeamIntegration__button-container align-center-class ">
            <Button className="TeamIntegration__button" onClick={() => this.refreshIntegration()}>
              {String.t('integrationPage.refreshList')}
            </Button>
          </div>
        )}
        {isFetchingContent && statusLabel === 'Active' && (
          <div className="TeamIntegration__content-loading">
            <div>{String.t('integrationPage.contentLoading')}</div>
            <Spinner />
          </div>
        )}
        {displaySharingSettings && (
          <SharingSettings
            onToggleSelect={this.handleToggleSharingSettings}
            onToggleSelectAll={this.handleToggleAllSharingSettings}
            integrationType={integrationLabel}
            content={content}
            selectedSettings={selectedSettings}
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
