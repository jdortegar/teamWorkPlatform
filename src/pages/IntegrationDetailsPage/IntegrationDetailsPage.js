import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip, notification } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UserIcon from '../../components/UserIcon';
import { ImageCard } from '../../components/cards';
import { boxLogo, googleDriveLogo } from '../../img';
import String from '../../translations';
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
    name: 'Box',
    link: 'https://app.box.com/apps',
    logo: boxLogo,
    integrate: (props, subscriberOrgId) => {
      props.integrateBox(subscriberOrgId);
    },
    revoke: (props, subscriberOrgId, notify) => {
      props.revokeBox(subscriberOrgId).then(res => notify(res, 'box'));
    }
  },
  google: {
    name: 'Google Drive',
    link: 'https://drive.google.com/drive/u/0/my-drive',
    logo: googleDriveLogo,
    integrate: (props, subscriberOrgId) => {
      props.integrateGoogle(subscriberOrgId);
    },
    revoke: (props, subscriberOrgId, notify) => {
      props.revokeGoogle(subscriberOrgId).then(res => notify(res, 'google'));
    }
  }
};

function showNotification(response, integration) {
  // const { status } = response;
  const status = 410;
  const duration = 7;
  const name = providers[integration].name;
  const link = `<a target="_blank" href=${providers[integration].link}>${providers[integration].link}</a>`;
  if (status === 200) {
    notification.success({
      message: String.t('integrationDetailsPage.notification.successMessage'),
      description: String.t('integrationDetailsPage.notification.successDescription'),
      duration
    });
  } else if (status === 410) {
    notification.error({
      message: String.t('integrationDetailsPage.notification.goneMessage'),
      description: `<p>${String.t('integrationDetailsPage.notification.goneDescription', { name, link })}</p>`,
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
  integrateBox: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  integrateGoogle: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  revokeBox: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  revokeGoogle: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
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
    const name = providers[integrationDetails].name;
    this.props.fetchIntegrations(subscriberOrgId);
    if (status) {
      if (status.includes('CREATED')) {
        notification.success({
          message: String.t('integrationDetailsPage.createdMessage'),
          description: String.t('integrationDetailsPage.createdDescription', { name }),
          duration: 5
        });
      } else {
        notification.error({
          message: status,
          description: String.t(`integrationDetailsPage.${status}`),
          duration: 5
        });
      }
    }
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      providers[integrationDetails].integrate(this.props, subscriberOrgId);
    } else {
      providers[integrationDetails].revoke(this.props, subscriberOrgId, showNotification);
    }
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];

    if (error) {
      return (
        <div>Request for Integrations failed.</div>
      );
    }

    if (working === true) {
      return null;
    }

    const imgSrc = providers[integrationDetails].logo;
    const name = providers[integrationDetails].name;
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
              </Link> / {String.t('integrationDetailsPage.integrations')}
            </div>
          }
        />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 4 }}>
              <div className="Integration-details__icon-container">
                <ImageCard imgSrc={imgSrc} size="large" />
                <div className="Integration-details__switch-container">
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
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 19 }} className="Integration-details__right-col">
              <div>
                <h1>{name}</h1>
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
