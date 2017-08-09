import React, { Component } from 'react';
import { Row, Col, Icon, notification } from 'antd';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { extractQueryParams } from '../../routes';
import IntegrationCard from '../../components/IntegrationCard';
import { badIntegration, successfulIntegration } from './notifications';
import { integrateBox, integrateGoogle, requestIntegrations } from '../../actions';
import './styles/style.css';

const propTypes = {
  match: object.isRequired,
  requestIntegrations: func.isRequired,
  integrations: object.isRequired,
  integrateGoogle: func.isRequired,
  integrateBox: func.isRequired
};

class Integrations extends Component {
  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestIntegrations(subscriberOrgId);

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = (<Icon type="close" style={{ color: '#f04134' }} />);
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = (<Icon type="check" style={{ color: '#00a854' }} />);
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
        <h1> Integrations </h1>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  integrations: state.integrations
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestIntegrations,
  integrateBox,
  integrateGoogle
}, dispatch);

Integrations.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
