import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, notification } from 'antd';
import { extractQueryParams } from '../../routes';
import { badIntegration, successfulIntegration } from './notifications';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import IntegrationCard from '../../components/IntegrationCard';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  requestIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  integrateGoogle: PropTypes.func.isRequired,
  integrateBox: PropTypes.func.isRequired
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

    // TODO: using data, see which ones are integrated, not integrated, and expired.
    // Expired only makes sense if integrated = true.
    // Render accordingly.
    const { google, box } = integrations;
    const googleIntegrated = google === 1;
    const googleExpired = (google) ? google.expired : undefined;
    const boxIntegrated = box === 1;
    const boxExpired = (box) ? box.expired : undefined;

    return (
      <div>
        <SubpageHeader breadcrumb={'Nintendo/Integrations'} />
        <SimpleHeader text={'Your Integrations'} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex">
            <Col className="gutter-row">
              <IntegrationCard
                name="Google Drive"
                img="https://s3-us-west-2.amazonaws.com/habla-ai-images/google-drive-logo.png"
                integrated={googleIntegrated}
                expired={googleExpired}
                handleIntegration={() => this.handleGoogleDrive()}
                onRevoke={() => console.log()}
              />
            </Col>
            <Col className="gutter-row">
              <IntegrationCard
                name="Box"
                img="https://s3-us-west-2.amazonaws.com/habla-ai-images/box-logo.png"
                integrated={boxIntegrated}
                expired={boxExpired}
                handleIntegration={() => this.handleBox()}
                onRevoke={() => console.log()}
              />
            </Col>
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

IntegrationsPage.propTypes = propTypes;

export default IntegrationsPage;
