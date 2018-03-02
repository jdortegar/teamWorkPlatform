import React, { Component } from 'react';
import { Switch, Tooltip, notification } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Spinner from '../../components/Spinner';
import { ImageCard } from '../../components/cards';
import String from '../../translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationLinkFromKey
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

const providers = {
  box: {
    integrate: (props, subscriberOrgId) => {
      props.integrateBox(subscriberOrgId);
    },
    revoke: (props, subscriberOrgId, notify) => {
      props.revokeBox(subscriberOrgId).then(res => notify(res, 'box'));
    }
  },
  google: {
    integrate: (props, subscriberOrgId) => {
      props.integrateGoogle(subscriberOrgId);
    },
    revoke: (props, subscriberOrgId, notify) => {
      _.debounce(
        props.revokeGoogle(subscriberOrgId).then(res => notify(res, 'google')),
        50
      );
    }
  },
  sharepoint: {
    integrate: (props, subscriberOrgId, sharepointOrg) => {
      props.integrateSharepoint(subscriberOrgId, sharepointOrg);
    },
    revoke: (props, subscriberOrgId, notify) => {
      _.debounce(
        props.revokeSharepoint(subscriberOrgId).then(res => notify(res, 'sharepoint')),
        50
      );
    }
  }
};

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
  integrateBox: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  integrateGoogle: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  integrateSharepoint: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  revokeBox: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  revokeGoogle: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  revokeSharepoint: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
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

    this.state = { view: 'card' };

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
    }
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      // const sharepointOrg = 'hablaaiinc'; // TODO: Mike: Obtain org name from user.  Prompt should be:  https://${sharepointOrg}.sharepoint.com to be clear to user.
      const sharepointOrg = 'korrelated';
      providers[integrationDetails].integrate(this.props, subscriberOrgId, sharepointOrg);
    } else {
      providers[integrationDetails].revoke(this.props, subscriberOrgId, showNotification);
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
          <Tooltip placement="top" title={currStatus === 'Active' ? String.t('integrationDetailsPage.deactivate') : String.t('integrationDetailsPage.activate')}>
            <Switch
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
