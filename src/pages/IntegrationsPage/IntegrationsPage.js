import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, notification, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { extractQueryParams } from '../../routes';
import { badIntegration, successfulIntegration } from './notifications';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import { ImageCard } from '../../components/cards';
import Spinner from '../../components/Spinner';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import {
  availableIntegrations,
  integrationImageFromKey,
  integrationLabelFromKey
} from '../../utils/dataIntegrations';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

class IntegrationsPage extends Component {
  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.fetchIntegrations(subscriberOrgId);

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = (<Icon type="close" className="icon_fail habla-red" />);
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = (<Icon type="check" className="icon_success habla-green" />);
      }
      // TODO: show notification.
      // ex. notifyInfo = { integration: 'bogus', status: 'CREATED' } will say something like "You have successfully authorized Bogus Drive access."
      // Also statuses FORBIDDEN = "You did not authorize Bogus Drive access."
      // NOT_FOUND, subscriberOrg doesn't exist, which should almost never happen, since they have access or we have a bug in our code.
      // INTERNAL_SERVER_ERROR,  don't know, display something appropriate...
      // Same for box.
      notification.open(args);
    }
  }

  notifyInfo() {
    const queryParams = extractQueryParams(this.props);
    const { integration, status } = queryParams;
    return ((integration) && (status)) ? queryParams : undefined;
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;
    const possibleIntegrations = availableIntegrations();

    if (error) {
      return (
        <div>{String.t('integrationsPage.errorMessage')}</div>
      );
    }

    const { match, subscriberOrgs } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !integrationsBySubscriberOrgId ||
        !subscriberOrgs || !subscriberOrgs.subscriberOrgById || working) {
      return <Spinner />;
    }
    const { subscriberOrgId } = match.params;
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || [];
    if (!integrations) {
      this.props.history.push('/app');
      return null;
    }

    const renderIntegrations = () => {
      const integrationsArr = [];

      Object.keys(possibleIntegrations).forEach((key) => {
        let extra = null;
        if (!_.isEmpty(integrations) && integrations[key]) {
          const { expired, revoked } = integrations[key];
          if ((typeof revoked === 'undefined') || (revoked === false)) {
            extra = (<i className="fa fa-check-circle icon_success habla-green" />);
            if (expired === true) {
              extra = (<i className="fa fa-times-circle habla-red" />);
            }
          }
        }
        integrationsArr.push(
          <div key={key}>
            <Tooltip placement="top" title={integrationLabelFromKey(key)}>
              <Link to={`/app/integrations/${subscriberOrgId}/${key}`}>
                <ImageCard imgSrc={integrationImageFromKey(key)} extra={extra} />
              </Link>
            </Tooltip>
          </div>
        );
      });

      return integrationsArr;
    };

    const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.push('/app');
      return null;
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
                { title: String.t('integrationsPage.breadcrumb') }
              ]}
            />
          }
        />
        <div className="padding-class-b">
          <div className="habla-paragraph">{String.t('integrationsPage.selectIntegration')}</div>
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex habla-integration-list margin-top-class-b">
            <Row type="flex">
              {renderIntegrations()}
            </Row>
          </SimpleCardContainer>
        </div>
      </div>
    );
  }
}

IntegrationsPage.propTypes = propTypes;

export default IntegrationsPage;
