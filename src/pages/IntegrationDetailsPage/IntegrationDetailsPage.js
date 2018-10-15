import React, { Component } from 'react';
import { Checkbox, Switch, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationConfigFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import './styles/style.css';

function determineStatus(integration) {
  if (integration) {
    if (integration.expired) {
      return String.t('integrationDetailsPage.status.expired');
    } else if (integration.revoked) {
      return String.t('integrationDetailsPage.status.revoked');
    }
    return String.t('integrationDetailsPage.status.active');
  }

  return false;
}

function showNotification(response, integration) {
  const { status } = response;
  const integrationLabel = integrationLabelFromKey(integration);
  if (status === 200) {
    message.success(String.t('integrationDetailsPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationDetailsPage.message.goneDescription', { name: integrationLabel }));
  } else {
    message.error(String.t('integrationDetailsPage.message.notFoundDescription'));
  }
}

const propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  integrateIntegration: PropTypes.func.isRequired,
  revokeIntegration: PropTypes.func.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  fetchIntegrationDetails: PropTypes.func.isRequired,
  toggleSharingSettings: PropTypes.func.isRequired,
  toggleAllSharingSettings: PropTypes.func.isRequired,
  saveSharingSettings: PropTypes.func.isRequired,
  // configureIntegration: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  subscriberOrgName: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  integration: PropTypes.object,
  integrationDetails: PropTypes.object,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array,
  status: PropTypes.string,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool
};

const defaultProps = {
  integration: null,
  integrationDetails: null,
  selectedFolders: [],
  selectedFiles: [],
  status: '',
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false
};

class IntegrationDetailsPage extends Component {
  constructor(props) {
    super(props);

    const config = integrationConfigFromKey(props.source);
    let configParams = null;
    let configFolders = null;
    if (config) {
      configParams = config.params;
      configFolders = config.folders;
    }
    this.state = {
      configParams,
      configFolders,
      changedFolderOptions: {}
    };

    this.handleIntegration = this.handleIntegration.bind(this);
    this.onSaveConfigChanges = this.onSaveConfigChanges.bind(this);
    this.handleToggleSharingSettings = this.handleToggleSharingSettings.bind(this);
    this.handleToggleAllSharingSettings = this.handleToggleAllSharingSettings.bind(this);
  }

  componentDidMount() {
    const { subscriberOrgId, subscriberUserId, source, status } = this.props;
    const integrationLabel = integrationLabelFromKey(source);
    this.props.fetchIntegrations(subscriberOrgId);
    this.props.fetchIntegrationDetails(source, subscriberUserId);
    if (status) {
      if (status.includes('CREATED')) {
        message.success(String.t('integrationDetailsPage.message.createdDescription', { name: integrationLabel }));
      } else {
        message.error(status);
      }

      // Remove status from visible url to disallow reloading and bookmarking of url with status.
      let { pathname: path } = this.props.location;
      path = path.substring(0, path.lastIndexOf('/'));
      this.props.history.replace(path);
    }
  }

  onSaveConfigChanges() {
    const changedFolderKeys = Object.keys(this.state.changedFolderOptions);
    if (changedFolderKeys.length > 0) {
      // initialize collection of folders with the saved selection flags
      // const { source, subscriberOrgId } = this.props;
      // const { integrationsBySubscriberOrgId } = this.props.integrations;
      // const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || {};
      // const integration = integrations[source];
      // const { configFolders, changedFolderOptions } = this.state;
      // const folders = integration[configFolders.key];
      // const { selected, folderKey } = configFolders.folderKeys;
      // const saveFolders = folders.map(folder => {
      //   let isSelected = folder[configFolders.folderKeys.selected]; // default
      //   const path = folder[folderKey];
      //   if (changedFolderOptions[path] !== undefined) {
      //     isSelected = changedFolderOptions[path];
      //   }
      //   const folderObj = {};
      //   folderObj[selected] = isSelected;
      //   folderObj[folderKey] = path;
      //   return folderObj;
      // });
      // const config = {};
      // config[configFolders.key] = saveFolders;
      // const configTop = {};
      // configTop[source] = config;
      // // save the changes
      // const name = integrationLabelFromKey(source);
      // this.props
      //   .configureIntegration(source, subscriberOrgId, configTop)
      //   .then(() => {
      //     message.success(String.t('integrationDetailsPage.message.configUpdated', { name }));
      //     this.setState({ changedFolderOptions: {} });
      //   })
      //   .catch(error => {
      //     message.error(error.message);
      //   });
    }
  }

  saveSharingSettings = () => {
    const { source, subscriberUserId, selectedFolders, selectedFiles } = this.props;
    this.props.saveSharingSettings(source, subscriberUserId, { folders: selectedFolders, files: selectedFiles });
  };

  handleToggleSharingSettings = ({ folderId, fileId }) => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleSharingSettings(subscriberUserId, source, { folderId, fileId });
  };

  handleToggleAllSharingSettings = () => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleAllSharingSettings(subscriberUserId, source);
  };

  handleIntegration(checked) {
    const { source, subscriberOrgId } = this.props;
    const key = integrationMapping(source);
    if (checked) {
      let configParams = null;
      if (this.state.configParams) {
        configParams = {};
        this.state.configParams.forEach(param => {
          configParams[param.key] = this[param.key].value;
        });
      }
      this.props.integrateIntegration(key, subscriberOrgId, configParams).catch(error => {
        message.error(error.message);
      });
    } else {
      this.props
        .revokeIntegration(key, subscriberOrgId)
        .then(res => showNotification(res, key))
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  renderFolder(folder, level) {
    const { folderKeys } = this.state.configFolders;
    const { selected, folderKey, subFolders } = folderKeys;
    const label = folder[folderKey];
    return (
      <div key={`${label}-${level}`}>
        <Checkbox
          className="Integration-details__config-folder-checkbox"
          defaultChecked={folder[selected]}
          onChange={e => {
            const { checked } = e.target;
            const changedFolderOptions = { ...this.state.changedFolderOptions };
            changedFolderOptions[label] = checked;
            this.setState({ changedFolderOptions });
          }}
        >
          <div className="Integration-details__config-folder">{label}</div>
        </Checkbox>
        {folder[subFolders] && folder[subFolders].map(subFolder => this.renderFolder(subFolder, level + 1))}
      </div>
    );
  }

  render() {
    const {
      integration,
      integrationDetails,
      source,
      subscriberOrgId,
      subscriberOrgName,
      selectedFolders,
      selectedFiles,
      isSubmittingSharingSettings,
      isSavedSharingSettings
    } = this.props;
    if (!source || !subscriberOrgId) {
      return <Spinner />;
    }

    const integrationKey = integrationMapping(source);
    const integrationImageSrc = integrationImageFromKey(integrationKey);
    const integrationLabel = integrationLabelFromKey(integrationKey);
    const statusLabel = determineStatus(integration);
    const tooltipTitle =
      statusLabel === 'Active'
        ? String.t('integrationDetailsPage.deactivate')
        : String.t('integrationDetailsPage.activate');
    let disabledSwitch = false;
    let disabledFields = false;

    let extraFormFields = null;
    const { configParams, configFolders } = this.state;
    if (configParams) {
      extraFormFields = [];
      configParams.forEach(({ key, label, placeholder }) => {
        let savedValue = null;
        if (integration) {
          savedValue = integration[key];
        }
        if (savedValue && savedValue.length) {
          disabledFields = true;
        } else {
          const inputField = this[key];
          if (inputField) {
            const { value } = inputField;
            const len = value.length;
            disabledSwitch = disabledSwitch || len < 3;
          }
        }
        extraFormFields.push(
          <div key={`${key}-configInput`} className="m-2">
            <label className="Integration-details__config-label">{label}</label>
            <input
              ref={ref => {
                this[key] = ref;
              }}
              className="Integration-details__config-input"
              placeholder={placeholder}
              onChange={() => this.setState({})}
              value={savedValue}
              disabled={disabledFields}
            />
          </div>
        );
      });
      if (integration && configFolders) {
        const { key, label } = configFolders;
        const folders = integration[key];
        if (folders) {
          const optionsChanged = Object.keys(this.state.changedFolderOptions).length > 0;
          extraFormFields.push(
            <div key="folders" className="m-2 Integration-details__config-container">
              <label className="Integration-details__config-folders-label">{label}</label>
              <div className="Integration-details__config-folders">
                {folders.map(fldr => this.renderFolder(fldr, 0))}
              </div>
              <div className="Integration-details__config-folders-save-button">
                <Button
                  type={optionsChanged ? 'main' : 'disable'}
                  fitText
                  onClick={this.onSaveConfigChanges}
                  loading={this.state.loading}
                  disabled={!optionsChanged}
                >
                  {String.t('integrationDetailsPage.saveButtonLabel')}
                </Button>
              </div>
            </div>
          );
        }
      }
    }

    return (
      <div>
        <PageHeader
          pageBreadCrumb={{
            routes: [
              {
                title: subscriberOrgName,
                url: `/app/organization/${subscriberOrgId}`
              },
              {
                title: String.t('integrationDetailsPage.integrations'),
                url: `/app/integrations/${subscriberOrgId}`
              },
              { title: integrationLabel }
            ]
          }}
          buttonOptions={{
            type: 'main',
            fitText: true,
            children: 'Save Settings',
            onClick: this.saveSharingSettings,
            loading: isSubmittingSharingSettings,
            disabled: isSavedSharingSettings || !integrationDetails
          }}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="Integration-details__icon-container">
            <ImageCard imgSrc={integrationImageSrc} size="large" />
          </div>
          <div className="habla-big-title habla-bold-text">{integrationLabel}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="Integration-details__switch-container align-center-class">
          {extraFormFields}
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              disabled={disabledSwitch}
              checkedChildren={String.t('integrationDetailsPage.on')}
              unCheckedChildren={String.t('integrationDetailsPage.off')}
              onChange={this.handleIntegration}
              checked={statusLabel === 'Active'}
            />
          </Tooltip>
        </div>
        {statusLabel === 'Active' &&
          integrationDetails && (
            <SharingSettings
              onToggleSelect={this.handleToggleSharingSettings}
              onToggleSelectAll={this.handleToggleAllSharingSettings}
              integrationType={integrationLabel}
              folders={integrationDetails.folders}
              files={integrationDetails.files}
              selectedFolders={selectedFolders}
              selectedFiles={selectedFiles}
            />
          )}
      </div>
    );
  }
}

IntegrationDetailsPage.propTypes = propTypes;
IntegrationDetailsPage.defaultProps = defaultProps;

export default IntegrationDetailsPage;
