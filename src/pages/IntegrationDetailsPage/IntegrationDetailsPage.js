import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { ImageCard } from '../../components/cards';
import { boxLogo, googleDriveLogo } from '../../img';
import messages from './messages';
import './styles/style.css';

function determineStatus(integration) {
  if (integration) {
    if (integration.expired) {
      return false;
    }

    return true;
  }

  return false;
}

const propTypes = {
  integrateBox: PropTypes.func.isRequired,
  integrateGoogle: PropTypes.func.isRequired,
  requestIntegrations: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired,
      integrationDetails: PropTypes.string.isRequired
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
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestIntegrations(subscriberOrgId);
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      if (integrationDetails === 'google') {
        this.props.integrateGoogle(subscriberOrgId);
      } else if (integrationDetails === 'box') {
        this.props.integrateBox(subscriberOrgId);
      }
    }
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    const subscriberOrgName = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId].name;

    if (error) {
      console.error(error);
      return (
        <div>Request for Integrations failed.</div>
      );
    }

    if (working === true) {
      return null;
    }

    let imgSrc;

    switch (integrationDetails) {
      case 'google':
        imgSrc = googleDriveLogo;
        break;
      case 'box':
        imgSrc = boxLogo;
        break;
      default:
        imgSrc = '';
        break;
    }

    const integrations = integrationsBySubscriberOrgId[subscriberOrgId];
    const status = determineStatus(integrations[integrationDetails]);

    return (
      <div>
        <SubpageHeader breadcrumb={<div><span className="breadcrumb_underline">{subscriberOrgName}</span> / {messages.integrations}</div>} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 4 }}>
              <div className="Integration-details__icon-container">
                <ImageCard imgSrc={imgSrc} size="large" />
                <div className="Integration-details__switch-container">
                  <Tooltip placement="top" title={status ? messages.deactivate : messages.activate}>
                    <Switch
                      checkedChildren={messages.on}
                      unCheckedChildren={messages.off}
                      onChange={this.handleIntegration}
                      defaultChecked={status}
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 19 }} className="Integration-details__right-col">
              <div>
                <h1>{messages[integrationDetails]}</h1>
              </div>
              <div>
                <h3>{status ? 'Active' : 'Expired'}</h3>
              </div>
            </Col>
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

IntegrationDetailsPage.propTypes = propTypes;

export default IntegrationDetailsPage;
