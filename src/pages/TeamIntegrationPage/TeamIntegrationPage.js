import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tooltip, Switch, message } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import {
  integrationConfigFromKey,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';
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
  configureTeamIntegration: PropTypes.func.isRequired,
  revokeTeamIntegration: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  integration: PropTypes.object,
  content: PropTypes.object,
  contentError: PropTypes.object,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool
};

const defaultProps = {
  integration: null,
  content: null,
  contentError: null,
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
  constructor(props) {
    super(props);

    const config = integrationConfigFromKey(props.source);
    this.state = {
      fields: {},
      configParams: config ? config.params : [],
      configFolders: config ? config.folders : null,
      configLoading: false,
      changedFolderOptions: {}
    };
  }

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

  handleSaveConfig = () => {
    const { changedFolderOptions, configFolders } = this.state;
    const changedFolders = Object.keys(changedFolderOptions);
    if (isEmpty(changedFolders)) return;

    const { integration, source, team, subscriberUserId } = this.props;
    const folders = integration[configFolders.key];
    const { selected, folderKey } = configFolders.folderKeys;

    const data = folders.map(folder => ({
      ...folder,
      [selected]: changedFolderOptions[folder[folderKey]] || folder[selected]
    }));
    const config = { [configFolders.key]: data };

    this.setState({ configLoading: true });
    this.props
      .configureTeamIntegration(source, team.teamId, config)
      .then(() => {
        this.setState({ changedFolderOptions: {}, configLoading: false });
        message.success(String.t('integrationPage.message.configUpdated', { name: integrationLabelFromKey(source) }));
        this.props.fetchIntegrationContent(source, subscriberUserId, team.teamId);
      })
      .catch(error => {
        this.setState({ configLoading: false });
        message.error(error.message);
      });
  };

  saveSharingSettings = () => {
    const { source, subscriberUserId, team } = this.props;
    this.props
      .saveTeamSharingSettings(source, subscriberUserId, team.teamId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  handleFieldChange = (key, event) => {
    this.setState({ fields: { ...this.state.fields, [key]: event.target.value } });
  };

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
    const { configParams } = this.state;
    const key = integrationMapping(source);
    if (checked) {
      const params = configParams.reduce((acc, item) => {
        acc[item.key] = this[item.key].value;
        return acc;
      }, {});
      integrateTeamIntegration(key, team.teamId, params).catch(error => message.error(error.message));
    } else {
      revokeTeamIntegration(key, integration.teamId, integration.userId)
        .then(res => showNotification(res, key))
        .catch(error => message.error(error.message));
    }
  };

  refreshIntegration = () => {
    const { source, team, integration, integrateTeamIntegration, revokeTeamIntegration } = this.props;
    const key = integrationMapping(source);

    revokeTeamIntegration(key, integration.teamId, integration.userId)
      .then(
        integrateTeamIntegration(key, team.teamId)
          .then(res => showNotification(res, key))
          .catch(error => message.error(error.message))
      )
      .catch(error => message.error(error.message));
  };

  renderConfigParams = () => {
    const { integration } = this.props;
    const { configParams, fields } = this.state;
    if (isEmpty(configParams)) return null;

    return configParams.map(({ key, label, placeholder }) => {
      const savedValue = integration ? integration[key] : '';
      return (
        <div key={`${key}-configInput`} className="m-2">
          <label className="Integration__config-label">{label}</label>
          <input
            ref={ref => {
              this[key] = ref;
            }}
            className="Integration__config-input"
            placeholder={placeholder}
            onChange={event => this.handleFieldChange(key, event)}
            value={savedValue || fields[key]}
            disabled={!isEmpty(savedValue)}
          />
        </div>
      );
    });
  };

  renderConfigFolders = () => {
    const { integration, isSavedSharingSettings, isSubmittingSharingSettings } = this.props;
    const { configParams, configFolders, configLoading, changedFolderOptions } = this.state;
    if (isEmpty(configParams) || !configFolders || !integration || getIntegrationStatus(integration) !== 'Active') {
      return null;
    }

    const { key, label } = configFolders;
    const folders = integration[key];
    if (!folders) return null;

    const optionsChanged = !isEmpty(changedFolderOptions);
    return (
      <div key="folders" className="m-2 Integration__config-container">
        <label className="Integration__config-folders-label">{label}</label>
        <div className="Integration__config-folders">{folders.map(this.renderConfigFolder)}</div>
        <div className="Integration__config-folders-save-button">
          <Button
            fitText
            type={optionsChanged ? 'main' : 'disable'}
            onClick={this.handleSaveConfig}
            loading={configLoading}
            disabled={!optionsChanged || isSavedSharingSettings || isSubmittingSharingSettings}
          >
            {String.t('integrationPage.saveButtonLabel')}
          </Button>
        </div>
      </div>
    );
  };

  renderConfigFolder = (folder, level = 0) => {
    const { isSavedSharingSettings, isSubmittingSharingSettings } = this.props;
    const { folderKeys } = this.state.configFolders;
    const { selected, folderKey, subFolders } = folderKeys;
    const label = folder[folderKey];
    return (
      <div key={`${label}-${level}`}>
        <Checkbox
          className="Integration__config-folder-checkbox"
          defaultChecked={folder[selected]}
          disabled={isSavedSharingSettings || isSubmittingSharingSettings}
          onChange={e => {
            const { checked } = e.target;
            const changedFolderOptions = { ...this.state.changedFolderOptions };
            changedFolderOptions[label] = checked;
            this.setState({ changedFolderOptions });
          }}
        >
          <div className="Integration__config-folder">{label}</div>
        </Checkbox>
        {folder[subFolders] && folder[subFolders].map(subFolder => this.renderConfigFolder(subFolder, level + 1))}
      </div>
    );
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
    const { configParams } = this.state;
    const integrationKey = integrationMapping(source);
    const integrationImageSrc = integrationImageFromKey(integrationKey);
    const integrationLabel = integrationLabelFromKey(integrationKey);
    const statusLabel = getIntegrationStatus(integration);
    const tooltipTitle =
      statusLabel === 'Active' ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');
    const disabledSwitch = configParams.some(param => this[param.key] && this[param.key].value.length < 3);
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
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="TeamIntegration__switch-container align-center-class">
          {this.renderConfigParams()}
          {this.renderConfigFolders()}
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              disabled={disabledSwitch}
              checkedChildren={String.t('integrationPage.on')}
              unCheckedChildren={String.t('integrationPage.off')}
              onChange={this.handleIntegration}
              checked={statusLabel === 'Active'}
            />
          </Tooltip>
        </div>
        {statusLabel === 'Active' && (
          <div className="TeamIntegration__button-container align-center-class ">
            {/* <span className="TeamIntegration_integration-date">
            {String.t('integrationPage.lastIntegrationDate', { date: 'Aug 24, 2018' })}
          </span> */}
            <Button className="TeamIntegration__button" onClick={() => this.refreshIntegration()}>
              {String.t('integrationPage.refreshList')}
            </Button>
          </div>
        )}
        {isFetchingContent && <Spinner />}
        {displaySharingSettings && (
          <SharingSettings
            onToggleSelect={this.handleToggleSharingSettings}
            onToggleSelectAll={this.handleToggleAllSharingSettings}
            integrationType={integrationLabel}
            content={content}
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
