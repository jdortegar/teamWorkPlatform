import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, notification, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { extractQueryParams } from '../../routes';
import { badIntegration, successfulIntegration } from './notifications';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import { ImageCard } from '../../components/cards';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UserIcon from '../../components/UserIcon';
import { boxLogo, googleDriveLogo } from '../../img';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  requestIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

class IntegrationsPage extends Component {
  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestIntegrations(subscriberOrgId);

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = (<Icon type="close" className="icon_fail" />);
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = (<Icon type="check" className="icon_success" />);
      }
      // TODO: show notification.
      // ex. notifyInfo = { integration: 'google', status: 'CREATED' } will say something like "You have successfully authorized Google Drive access."
      // Also statuses FORBIDDEN = "You did not authorize Google Drive access."
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

    if (error) {
      console.error(error);
      return (
        <div>Request for Integrations failed.</div>
      );
    }

    if (working === true) {
      return null;
    }

    const { subscriberOrgId } = this.props.match.params;
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || [];

    const renderIntegrations = () => {
      const integrationsArr = [];
      let boxExtra = null;
      let googleExtra = null;

      if (!_.isEmpty(integrations)) {
        const { google, box } = integrations;
        if (box) {
          boxExtra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (box.expired) {
            boxExtra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
          }
        }

        if (google) {
          googleExtra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (google.expired) {
            googleExtra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
          }
        }
      }
      integrationsArr.push(
        <div key="box">
          <Tooltip placement="top" title={messages.box}>
            <Link to={`/app/integrations/${subscriberOrgId}/box`}>
              <ImageCard imgSrc={boxLogo} extra={boxExtra} />
            </Link>
          </Tooltip>
        </div>
      );
      integrationsArr.push(
        <div key="google">
          <Tooltip placement="top" title={messages.google}>
            <Link to={`/app/integrations/${subscriberOrgId}/google`}>
              <ImageCard imgSrc={googleDriveLogo} extra={googleExtra} />
            </Link>
          </Tooltip>
        </div>
      );

      return integrationsArr;
    };

    const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];
    console.log(subscriberOrg);

    return (
      <div>
        <SubpageHeader
          icon={<UserIcon user={subscriberOrg} type="team" clickable={false} />}
          breadcrumb={<div><span className="breadcrumb_underline">{subscriberOrg.name}</span> / {messages.addNewIntegrations}</div>}
        />
        <SimpleHeader
          text={
            <h2 className="IntegrationsPage__header">{messages.selectIntegration}</h2>
          }
          type="node"
        />
        <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex">
          <Row type="flex">
            {renderIntegrations()}
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

IntegrationsPage.propTypes = propTypes;

export default IntegrationsPage;
