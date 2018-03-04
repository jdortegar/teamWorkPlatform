import React, { Component } from 'react';
import { Checkbox, Switch, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Spinner from '../../components/Spinner';
import { ImageCard } from '../../components/cards';
import String from '../../translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationLinkFromKey,
  availableIntegrations
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
  const uri = integrationLinkFromKey(integration);
  const link = `<a target="_blank" href=${uri}>${uri}</a>`;
  if (status === 200) {
    message.success(String.t('integrationDetailsPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationDetailsPage.message.goneDescription', { name, link }));
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired,
      integrationDetails: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

class IntegrationDetailsPage extends Component {
  constructor(props) {
    super(props);

    const possibleIntegrations = availableIntegrations();
    const { integrationDetails } = props.match.params;
    const currentIntegration = possibleIntegrations[integrationDetails];
    let configParams = null;
    let configFolders = null;
    if (currentIntegration && currentIntegration.config) {
      configParams = currentIntegration.config.params;
      configFolders = currentIntegration.config.folders;
    }
    this.state = { view: 'card', configParams, configFolders };

    this.handleIntegration = this.handleIntegration.bind(this);
  }

  componentDidMount() {
    const { subscriberOrgId, status, integrationDetails } = this.props.match.params;
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

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      let configParams = null;
      if (this.state.configParams) {
        configParams = {};
        this.state.configParams.forEach((param) => {
          configParams[param.key] = this[param.key].value;
        });
      }
      this.props.integrateIntegration(integrationDetails, subscriberOrgId, configParams);
    } else {
      this.props.revokeIntegration(integrationDetails, subscriberOrgId)
        .then(res => showNotification(res, integrationDetails));
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
          defaultChecked={selected}
        >
          <div className="Integration-details__config-folder">{label}</div>
        </Checkbox>
        {folder[subFolders] &&
            folder[subFolders].map(subFolder => this.renderFolder(subFolder, level + 1))
        }
      </div>
    );
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;

    if (error) {
      return (
        <div>Request for Integrations failed.</div>
      );
    }

    const { match, subscriberOrgs } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !match.params.integrationDetails ||
      !integrationsBySubscriberOrgId || !subscriberOrgs || working) {
      return <Spinner />;
    }
    const { integrationDetails, subscriberOrgId } = match.params;
    const subscriberOrg = subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      return <Spinner />;
    }

    const imgSrc = integrationImageFromKey(integrationDetails);
    const name = integrationLabelFromKey(integrationDetails);
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || {};
    const integration = integrations[integrationDetails];
    const currStatus = determineStatus(integration);
    const tooltipTitle = currStatus === 'Active' ? String.t('integrationDetailsPage.deactivate') : String.t('integrationDetailsPage.activate');
    let disabledSwitch = false;
    let disabledFields = false;

    let extraFormFields = null;
    const { configParams, configFolders } = this.state;
    if (configParams) {
      extraFormFields = [];
      configParams.forEach(({ key, label, placeholder }) => {
        const savedValue = integration[key];
        if (savedValue && savedValue.length) {
          disabledFields = true;
        } else {
          const inputField = this[key];
          if (inputField) {
            const value = inputField.value;
            const len = value.length;
            disabledSwitch = disabledSwitch || (len < 3);
          }
        }
        extraFormFields.push((
          <div className="m-2">
            <label className="Integration-details__config-label">{label}</label>
            <input
              ref={(ref) => { this[key] = ref; }}
              className="Integration-details__config-input"
              placeholder={placeholder}
              onChange={() => this.setState({})}
              value={savedValue}
              disabled={disabledFields}
            />
          </div>
        ));
      });
      if (configFolders) {
        const { key, label } = configFolders;
        const folders = integration[key];
        if (folders) {
          extraFormFields.push((
            <div className="m-2 Integration-details__config-container">
              <label className="Integration-details__config-folders-label">{label}</label>
              <div className="Integration-details__config-folders">
                {folders.map(fldr => this.renderFolder(fldr, 0))}
              </div>
            </div>
          ));
        }
      }
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
          <div className="habla-big-title habla-bold-text">
            {name}
          </div>
          <div className="habla-secondary-paragraph margin-top-class-b">
            {currStatus}
          </div>
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
      </div>
    );
  }
}

IntegrationDetailsPage.propTypes = propTypes;

export default IntegrationDetailsPage;
