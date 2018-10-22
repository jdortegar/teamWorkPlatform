import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import { PageHeader, ImageCard, Spinner, SimpleCardContainer } from 'src/components';
import {
  availableIntegrationKeys,
  integrationImageFromKey,
  integrationIsSupported,
  integrationLabelFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  integrations: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  fetchTeamIntegrations: PropTypes.func.isRequired
};

class TeamIntegrationsPage extends Component {
  componentDidMount() {
    const { team, fetchTeamIntegrations } = this.props;
    if (!team) {
      this.props.history.replace('/app');
      return;
    }
    fetchTeamIntegrations(team.teamId);
  }

  renderIntegration = (key, integration) => {
    const { team } = this.props;
    const isSupported = integrationIsSupported(key);
    let extra = null;
    if (integration) {
      const { expired, revoked } = integration;
      if (typeof revoked === 'undefined' || revoked === false) {
        extra = <i className="fa fa-check-circle icon_success habla-green" />;
        if (expired === true) {
          extra = <i className="fa fa-times-circle habla-red" />;
        }
      }
    }

    return (
      <div key={key} className={classNames('TeamIntegration', { inactive: !isSupported })}>
        <Tooltip placement="top" title={integrationLabelFromKey(key)}>
          {isSupported ? (
            <Link to={`/app/teamIntegrations/${team.teamId}/${key}`}>
              <ImageCard imgSrc={integrationImageFromKey(key)} extra={extra} />
            </Link>
          ) : (
            <ImageCard imgSrc={integrationImageFromKey(key)} extra={extra} />
          )}
        </Tooltip>
        <div className="habla-label align-center-class card-label">{integrationLabelFromKey(key)}</div>
      </div>
    );
  };

  renderIntegrations = () => {
    const { integrations } = this.props;
    return availableIntegrationKeys().map(key => this.renderIntegration(key, integrations[integrationMapping(key)]));
  };

  render() {
    const { team, integrations } = this.props;

    if (!team || !integrations) {
      return <Spinner />;
    }

    return (
      <div className="TeamIntegrations">
        <PageHeader
          pageBreadCrumb={{
            routes: [
              {
                title: team.name,
                url: `/app/team/${team.teamId}`
              },
              {
                title: String.t('integrationsPage.breadcrumb')
              }
            ]
          }}
          hasMenu
          menuName="settings"
          backButton={`/app/team/manage/${team.teamId}`}
          menuPageHeader={[
            {
              icon: 'fas fa-pencil-alt',
              title: 'TeamPage.editTeam',
              url: `/app/editTeam/${team.teamId}`
            }
          ]}
        />
        <div className="padding-class-a">
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex habla-integration-list margin-top-class-b">
            <Row type="flex">{this.renderIntegrations()}</Row>
          </SimpleCardContainer>
        </div>
      </div>
    );
  }
}

TeamIntegrationsPage.propTypes = propTypes;

export default TeamIntegrationsPage;
