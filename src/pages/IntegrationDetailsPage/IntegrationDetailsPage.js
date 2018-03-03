import React, { Component } from 'react';
import { /* Form, */ Switch, Tooltip, notification } from 'antd';
import PropTypes from 'prop-types';
// import { formShape } from 'propTypes';
// import TextField from 'components/formFields/TextField';
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
  const duration = 7;
  const name = integrationLabelFromKey(integration);
  const uri = integrationLinkFromKey(integration);
  const link = `<a target="_blank" href=${uri}>${uri}</a>`;
  if (status === 200) {
    notification.success({
      message: String.t('integrationDetailsPage.notification.successMessage'),
      description: String.t('integrationDetailsPage.notification.successDescription'),
      duration
    });
  } else if (status === 410) {
    notification.error({
      message: String.t('integrationDetailsPage.notification.goneMessage'),
      description: <p>{String.t('integrationDetailsPage.notification.goneDescription', { name, link })}</p>,
      duration
    });
  } else {
    notification.error({
      message: String.t('integrationDetailsPage.notification.notFoundMessage'),
      description: String.t('integrationDetailsPage.notification.notFoundDescription'),
      duration
    });
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
    const configParams = (currentIntegration && currentIntegration.config) ? currentIntegration.config.params : null;
    this.state = { view: 'card', configParams };

    this.handleIntegration = this.handleIntegration.bind(this);
  }

  componentDidMount() {
    const { subscriberOrgId, status, integrationDetails } = this.props.match.params;
    const name = integrationLabelFromKey(integrationDetails);
    this.props.fetchIntegrations(subscriberOrgId);
    if (status) {
      if (status.includes('CREATED')) {
        notification.success({
          message: String.t('integrationDetailsPage.notification.createdMessage'),
          description: String.t('integrationDetailsPage.notification.createdDescription', { name }),
          duration: 5
        });
      } else {
        notification.error({ // TODO: Figure what this should show and localize the strings
          message: status,
          description: null,
          duration: 5
        });
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
    const currStatus = determineStatus(integrations[integrationDetails]);
    const tooltipTitle = currStatus === 'Active' ? String.t('integrationDetailsPage.deactivate') : String.t('integrationDetailsPage.activate');
    let disabled = false;

    let extraFormFields = null;
    const { configParams } = this.state;
    if (configParams) {
      extraFormFields = [];
      configParams.forEach(({ key, label, placeholder }) => {
        const inputField = this[key];
        if (inputField) {
          const value = inputField.value;
          const len = value.length;
          disabled = disabled || (len < 3);
        }
        extraFormFields.push((
          <div className="m-2">
            <label className="Integration-details__config-label">
              {label}:
            </label>
            <input
              ref={(ref) => { this[key] = ref; }}
              className="Integration-details__config-input"
              placeholder={placeholder}
              onChange={() => {
                this.setState({});
              }}
            />
          </div>
        ));
      });
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
              disabled={disabled}
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
