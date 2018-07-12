import React, { Component } from 'react';
import { Checkbox, Switch, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Button from '../../components/common/Button';
import Spinner from '../../components/Spinner';
import { ImageCard } from '../../components/cards';
import SharingSettings from '../../components/SharingSettings';
import { SharingTypes } from '../../redux-hablaai/selectors';
import String from '../../translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationConfigFromKey,
  integrationMapping
} from '../../utils/dataIntegrations';
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
  const name = integrationLabelFromKey(integration);
  if (status === 200) {
    message.success(String.t('integrationDetailsPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationDetailsPage.message.goneDescription', { name }));
  } else {
    message.error(String.t('integrationDetailsPage.message.notFoundDescription'));
  }
}

const propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  integrateIntegration: PropTypes.func.isRequired,
  revokeIntegration: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  configureIntegration: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired,
      integrationDetails: PropTypes.string.isRequired,
      status: PropTypes.string
    }).isRequired
  }).isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  foldersAndFiles: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired
};

class IntegrationDetailsPage extends Component {
  constructor(props) {
    super(props);

    const { integrationDetails } = props.match.params;
    const config = integrationConfigFromKey(integrationDetails);
    let configParams = null;
    let configFolders = null;
    if (config) {
      configParams = config.params;
      configFolders = config.folders;
    }
    this.state = {
      view: 'card',
      configParams,
      configFolders,
      changedFolderOptions: {}
    };

    this.handleIntegration = this.handleIntegration.bind(this);
    this.onSaveConfigChanges = this.onSaveConfigChanges.bind(this);
  }

  componentDidMount() {
    const { match, subscriberOrgs } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      match.params.subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId
    ) {
      if (subscriberOrgs) {
        this.props.history.replace(`/app/integrations/${subscriberOrgs.currentSubscriberOrgId}`);
      } else {
        this.props.history.replace('/app');
      }
      return;
    }
    const { subscriberOrgId, status, integrationDetails } = match.params;
    const name = integrationLabelFromKey(integrationDetails);
    this.props.fetchIntegrations(subscriberOrgId);
    if (status) {
      if (status.includes('CREATED')) {
        message.success(String.t('integrationDetailsPage.message.createdDescription', { name }));
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
      const { integrationsBySubscriberOrgId } = this.props.integrations;
      const { integrationDetails, subscriberOrgId } = this.props.match.params;
      const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || {};
      const integration = integrations[integrationDetails];
      const { configFolders, changedFolderOptions } = this.state;
      const folders = integration[configFolders.key];
      const { selected, folderKey } = configFolders.folderKeys;
      const saveFolders = folders.map(folder => {
        let isSelected = folder[configFolders.folderKeys.selected]; // default
        const path = folder[folderKey];
        if (changedFolderOptions[path] !== undefined) {
          isSelected = changedFolderOptions[path];
        }
        const folderObj = {};
        folderObj[selected] = isSelected;
        folderObj[folderKey] = path;
        return folderObj;
      });

      const config = {};
      config[configFolders.key] = saveFolders;
      const configTop = {};
      configTop[integrationDetails] = config;

      // save the changes
      const name = integrationLabelFromKey(integrationDetails);
      this.props
        .configureIntegration(integrationDetails, subscriberOrgId, configTop)
        .then(() => {
          message.success(String.t('integrationDetailsPage.message.configUpdated', { name }));
          this.setState({ changedFolderOptions: {} });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    const key = integrationMapping(integrationDetails);
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
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;

    if (error) {
      return <div>Request for Integrations failed.</div>;
    }

    const { match, subscriberOrgs } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      !match.params.integrationDetails ||
      !integrationsBySubscriberOrgId ||
      !subscriberOrgs ||
      working
    ) {
      return <Spinner />;
    }
    const { integrationDetails, subscriberOrgId } = match.params;
    const subscriberOrg = subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      return <Spinner />;
    }

    const integrationKey = integrationMapping(integrationDetails);
    const imgSrc = integrationImageFromKey(integrationKey);
    const name = integrationLabelFromKey(integrationKey);
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || {};
    const integration = integrations[integrationKey];
    const currStatus = determineStatus(integration);
    const tooltipTitle =
      currStatus === 'Active'
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

    // Sharing Settings.
    const integrationType = integrationLabelFromKey(integrationDetails);
    let primaryTree;
    let secondaryTree;
    let sharingType;
    const allText = String.t('integrationDetailsPage.sharing.all');
    const customText = String.t('integrationDetailsPage.sharing.custom');
    if (currStatus === 'Active') {
      primaryTree = this.props.foldersAndFiles;
      secondaryTree = this.props.teams;
      sharingType = primaryTree.shareWithIds.length() > 0 ? SharingTypes.SOME : SharingTypes.ALL;
    }

    return (
      <div>
        <SubpageHeader
          subscriberOrgId={subscriberOrgId}
          history={this.props.history}
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                {
                  title: String.t('integrationDetailsPage.integrations'),
                  link: `/app/integrations/${subscriberOrg.subscriberOrgId}`
                },
                { title: name }
              ]}
            />
          }
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="Integration-details__icon-container">
            <ImageCard imgSrc={imgSrc} size="large" />
          </div>
          <div className="habla-big-title habla-bold-text">{name}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{currStatus}</div>
        </SimpleCardContainer>
        <div className="Integration-details__switch-container align-center-class">
          {extraFormFields}
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              disabled={disabledSwitch}
              checkedChildren={String.t('integrationDetailsPage.on')}
              unCheckedChildren={String.t('integrationDetailsPage.off')}
              onChange={this.handleIntegration}
              checked={currStatus === 'Active'}
            />
          </Tooltip>
        </div>
        {currStatus === 'Active' && (
          <SharingSettings
            integrationType={integrationType}
            primaryTree={primaryTree}
            sharingType={sharingType}
            allText={allText}
            customText={customText}
            secondaryTree={secondaryTree}
            shareWithIds={primaryTree.shareWithIds}
            parentNode={{ id: 'ROOT' }} // Parent is node in other tree.
            collapsible
          />
        )}
      </div>
    );
  }
}

IntegrationDetailsPage.propTypes = propTypes;

export default IntegrationDetailsPage;
