import React, { Component } from 'react';
import { Checkbox, Switch, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationConfigFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import './styles/style.css';

// const fakeIntegration = {
//   sites: [
//     { site: 'https://hablaaiinc.sharepoint.com/sites/WesternDigital', selected: false },
//     { site: 'https://hablaaiinc.sharepoint.com/sites/LambWeston2', selected: false },
//     { site: 'https://hablaaiinc.sharepoint.com/sites/EJGallo', selected: false },
//     { site: 'https://hablaaiinc.sharepoint.com/sites/hablatestteam', selected: false }
//   ]
// };

function showNotification(response, integration) {
  const { status } = response;
  const integrationLabel = integrationLabelFromKey(integration);
  if (status === 200) {
    message.success(String.t('integrationPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationPage.message.goneDescription', { name: integrationLabel }));
  } else {
    message.error(String.t('integrationPage.message.notFoundDescription'));
  }
}

const propTypes = {
  integrateOrgIntegration: PropTypes.func.isRequired,
  revokeOrgIntegration: PropTypes.func.isRequired,
  configureIntegration: PropTypes.func.isRequired,
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
  selectedFolders: [],
  selectedFiles: [],
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false
};

class IntegrationPage extends Component {
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

  handleSaveConfig = () => {
    const { changedFolderOptions, configFolders } = this.state;
    const changedFolders = Object.keys(changedFolderOptions);
    if (isEmpty(changedFolders)) return;

    const { integration, source, orgId } = this.props;
    const folders = integration[configFolders.key];
    const { selected, folderKey } = configFolders.folderKeys;

    const data = folders.map(folder => ({
      ...folder,
      [selected]: changedFolderOptions[folder[folderKey]] || folder[selected]
    }));
    const config = { [configFolders.key]: data };

    this.setState({ configLoading: true });
    this.props
      .configureIntegration(source, orgId, config)
      .then(() => {
        this.setState({ changedFolderOptions: {}, configLoading: false });
        message.success(String.t('integrationPage.message.configUpdated', { name: integrationLabelFromKey(source) }));
      })
      .catch(error => {
        this.setState({ configLoading: false });
        message.error(error.message);
      });
  };

  saveSharingSettings = () => {
    const { source, subscriberUserId } = this.props;
    this.props
      .saveOrgSharingSettings(source, subscriberUserId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  handleFieldChange = (key, event) => {
    this.setState({ fields: { ...this.state.fields, [key]: event.target.value } });
  };

  handleToggleSharingSettings = ({ folderId, fileId }) => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleOrgSharingSettings(subscriberUserId, source, { folderId, fileId });
  };

  handleToggleAllSharingSettings = selectAll => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleAllOrgSharingSettings(subscriberUserId, source, { selectAll });
  };

  handleIntegration = checked => {
    const { source } = this.props;
    const { configParams } = this.state;
    const key = integrationMapping(source);
    if (checked) {
      const params = configParams.reduce((acc, item) => {
        acc[item.key] = this[item.key].value;
        return acc;
      }, {});
      this.props.integrateOrgIntegration(key, params).catch(error => {
        message.error(error.message);
      });
    } else {
      this.props
        .revokeOrgIntegration(key)
        .then(res => showNotification(res, key))
        .catch(error => {
          message.error(error.message);
        });
    }
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
    const { integration, configParams, configFolders, configLoading, changedFolderOptions } = this.state;
    if (!integration || isEmpty(configParams) || !configFolders) return null;

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
            type={optionsChanged ? 'main' : 'disable'}
            fitText
            onClick={this.handleSaveConfig}
            loading={configLoading}
            disabled={!optionsChanged}
          >
            {String.t('integrationPage.saveButtonLabel')}
          </Button>
        </div>
      </div>
    );
  };

  renderConfigFolder = (folder, level = 0) => {
    const { folderKeys } = this.state.configFolders;
    const { selected, folderKey, subFolders } = folderKeys;
    const label = folder[folderKey];
    return (
      <div key={`${label}-${level}`}>
        <Checkbox
          className="Integration__config-folder-checkbox"
          defaultChecked={folder[selected]}
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
      integration,
      content,
      source,
      orgId,
      orgName,
      selectedFolders,
      selectedFiles,
      isSubmittingSharingSettings,
      isSavedSharingSettings,
      isFetchingContent
    } = this.props;
    const { configParams } = this.state;
    if (!source || !orgId) return <Spinner />;

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
      <div className="Integration">
        <PageHeader
          backButton
          pageBreadCrumb={{
            routes: [
              {
                title: orgName,
                url: `/app/organization/${orgId}`
              },
              { title: String.t('integrationPage.integrations') }
            ]
          }}
          buttonOptions={saveButtonOptions}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="Integration__icon-container">
            <ImageCard imgSrc={integrationImageSrc} size="large" />
          </div>
          <div className="habla-big-title">{integrationLabel}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="Integration__switch-container align-center-class">
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
        {isFetchingContent && <Spinner />}
        {displaySharingSettings && (
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

IntegrationPage.propTypes = propTypes;
IntegrationPage.defaultProps = defaultProps;

export default IntegrationPage;
