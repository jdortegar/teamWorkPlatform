import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip, notification } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UserIcon from '../../components/UserIcon';
import { ImageCard } from '../../components/cards';
import { boxLogo, googleDriveLogo } from '../../img';
import messages from './messages';
import './styles/style.css';

function determineStatus(integration) {
  if (integration) {
    if (integration.expired) {
      return 'Expired';
    } else if (integration.revoked) {
      return 'Revoked';
    }
    return 'Active';
  }

  return false;
}

function showNotification(status, integration) {
  if (status === 200) {
    notification.success({
      message: 'SUCCESS',
      description: 'Habla AI no longer has access to your account.',
      duration: 7
    });
  } else if (status === 410) {
    notification.error({
      message: 'GONE',
      description: `Habla AI no longer has access to your ${integration} account, but ${integration} seems to have trouble deauthorizing on their end.  Please check your ${integration}} account to make sure everything is OK`,
      duration: 7
    });
  } else {
    notification.error({
      message: 'NOT FOUND',
      description: 'We’re sorry, but something must’ve gone terribly wrong',
      duration: 7
    });
  }
}

const propTypes = {
  integrateBox: PropTypes.func.isRequired,
  integrateGoogle: PropTypes.func.isRequired,
  revokeBox: PropTypes.func.isRequired,
  revokeGoogle: PropTypes.func.isRequired,
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
    this.props.fetchIntegrations(subscriberOrgId);
    if (status) {
      if (status.includes('CREATED')) {
        notification.success({
          message: 'CREATED',
          description: `Your ${integrationDetails} integration is good to go!`,
          duration: 5
        });
      } else {
        notification.error({
          message: status,
          description: messages[status],
          duration: 5
        });
      }
    }
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      if (integrationDetails === 'google') {
        this.props.integrateGoogle(subscriberOrgId);
      } else if (integrationDetails === 'box') {
        this.props.integrateBox(subscriberOrgId);
      }
    } else {
      if (integrationDetails === 'google') {
        this.props.revokeGoogle(subscriberOrgId)
          .then((status) => {
            showNotification(status, integrationDetails);
          });
      } else if (integrationDetails === 'box') {
        this.props.revokeBox(subscriberOrgId);
      }
    }
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];

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

    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || {};
    const currStatus = determineStatus(integrations[integrationDetails]);

    return (
      <div>
        <SubpageHeader
          icon={<UserIcon user={subscriberOrg} type="team" clickable={false} />}
          breadcrumb={
            <div>
              <Link to={`/app/organization/${subscriberOrgId}`}>
                <span className="breadcrumb_underline">{subscriberOrg.name}</span>
              </Link> / {messages.integrations}
            </div>
          }
        />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 4 }}>
              <div className="Integration-details__icon-container">
                <ImageCard imgSrc={imgSrc} size="large" />
                <div className="Integration-details__switch-container">
                  <Tooltip placement="top" title={currStatus === 'Active' ? messages.deactivate : messages.activate}>
                    <Switch
                      checkedChildren={messages.on}
                      unCheckedChildren={messages.off}
                      onChange={this.handleIntegration}
                      defaultChecked={currStatus === 'Active'}
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
                <h3>{currStatus}</h3>
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
