import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, notification } from 'antd';
import {Link } from 'react-router-dom';
import { extractQueryParams } from '../../routes';
import { badIntegration, successfulIntegration } from './notifications';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import { IconCard } from '../../components/cards';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  requestIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  integrateGoogle: PropTypes.func.isRequired,
  integrateBox: PropTypes.func.isRequired
};

let integrationsAvailable = 2;
const totalIntegrations = 2;

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

  handleGoogleDrive() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateGoogle(subscriberOrgId);
  }

  handleBox() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateBox(subscriberOrgId);
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

      if (!_.isEmpty(integrations)) {
        const { google, box } = integrations;
        let boxExtra = null;
        let googleExtra = null;
        if (box) {
          boxExtra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (box.expired) {
            boxExtra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
            integrationsAvailable -= 1;
          }
        } else {
          integrationsAvailable -= 1;
        }
        integrationsArr.push(
          <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} key="box">
            <Link to={`/app/integrations/${subscriberOrgId}/box`}>
              <IconCard text="Box" icon={boxExtra} />
            </Link>
          </Col>
        );
        if (google) {
          googleExtra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
          if (google.expired) {
            googleExtra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
            integrationsAvailable -= 1;
          }
        } else {
          integrationsAvailable -= 1;
        }
        integrationsArr.push(
          <Col xs={{ span: 8 }} sm={{ span: 5 }} md={{ span: 4 }} key="google">
            <Link to={`/app/integrations/${subscriberOrgId}/google`}>
              <IconCard text="Google" extra={googleExtra} />
            </Link>
          </Col>
        );
      }

      return integrationsArr;
    };

    return (
      <div>
        <SubpageHeader breadcrumb={'Nintendo/Integrations'} />
        <SimpleHeader
          text={
            <h1 className="IntegrationsPage__header">{`${integrationsAvailable} of ${totalIntegrations} Integrations available`}</h1>
          }
          type="node"
        />
        <SimpleCardContainer className="subpage-block">
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
