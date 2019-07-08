import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

import String from 'src/translations';
import { getIntegrationStatus, displayRevokeMessage } from 'src/lib/integrations';
import { IntegrationScreen } from 'src/components';

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
  userEmail: PropTypes.string
};

const defaultProps = {
  integration: null,
  content: null,
  contentError: null,
  selectedSettings: {},
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false,
  userEmail: ''
};

class TeamIntegrationPage extends Component {
  componentDidMount() {
    const { team, source, subscriberUserId, integration } = this.props;
    this.props.fetchTeamIntegrations(team.teamId);
    if (getIntegrationStatus(integration) === 'Active') {
      this.props.fetchIntegrationContent(source, subscriberUserId, team.teamId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { integration, contentError } = nextProps;
    if (contentError && !this.props.contentError && getIntegrationStatus(integration) === 'Active') {
      message.error(String.t('integrationPage.message.contentError'));
    }
  }

  switchIntegration = checked => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;
    if (checked) {
      integrateTeamIntegration(source, team.teamId).catch(error => message.error(error.message));
    } else {
      revokeTeamIntegration(source, integration.teamId, integration.userId)
        .then(res => displayRevokeMessage(res.status, source))
        .catch(error => message.error(error.message));
    }
  };

  refreshIntegration = () => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;
    revokeTeamIntegration(source, integration.teamId, integration.userId)
      .then(
        integrateTeamIntegration(source, team.teamId)
          .then(res => displayRevokeMessage(res.status, source))
          .catch(error => message.error(error.message))
      )
      .catch(error => message.error(error.message));
  };

  saveSharingSettings = () => {
    const { source, subscriberUserId, team } = this.props;
    this.props
      .saveTeamSharingSettings(source, subscriberUserId, team.teamId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  toggleSharingSettings = ({ folderId, fileId }) => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleTeamSharingSettings(subscriberUserId, source, team.teamId, { folderId, fileId });
  };

  toggleAllSharingSettings = selectAll => {
    const { subscriberUserId, team, source } = this.props;
    this.props.toggleAllTeamSharingSettings(subscriberUserId, source, team.teamId, { selectAll });
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
      userEmail
    } = this.props;

    return (
      <IntegrationScreen
        team={team}
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
        userEmail={userEmail}
      />
    );
  }
}

TeamIntegrationPage.propTypes = propTypes;
TeamIntegrationPage.defaultProps = defaultProps;

export default TeamIntegrationPage;
