import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, notification, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import String from 'src/translations';
import { extractQueryParams } from 'src/routes';
import { PageHeader, ImageCard, Spinner, SimpleCardContainer } from 'src/components';
import {
  availableIntegrationKeys,
  integrationImageFromKey,
  integrationIsSupported,
  integrationLabelFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';
import { badIntegration, successfulIntegration } from './notifications';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  fetchTeamIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.array.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired
};

class TeamIntegrationsPage extends Component {
  componentDidMount() {
    const { match, subscriberOrgs } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.teamId ||
      match.params.subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId
    ) {
      return;
    }
    const { teamId } = this.props.match.params;
    this.props.fetchTeamIntegrations(teamId);

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = <Icon type="close" className="icon_fail habla-red" />;
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = <Icon type="check" className="icon_success habla-green" />;
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
    return integration && status ? queryParams : undefined;
  }

  render() {
    const teamIntegrations = this.props.integrations || [];
    const possibleIntegrationKeys = availableIntegrationKeys();

    // if (error) {
    //   return <div>{String.t('integrationsPage.errorMessage')}</div>;
    // }
    const { teams, match, subscriberOrgs } = this.props;
    const { teamId } = match.params;
    const team = teams[teamId];

    if (
      !match ||
      !match.params ||
      !match.params.teamId ||
      !teamIntegrations ||
      !subscriberOrgs ||
      !subscriberOrgs.subscriberOrgById
    ) {
      return <Spinner />;
    }

    // if (!integrations) {
    //   this.props.history.replace(`/app/teamIntegrations/${subscriberOrgs.currentSubscriberOrgId}`);
    //   return null;
    // }

    const renderIntegrations = active => {
      const integrationsArr = [];
      possibleIntegrationKeys.forEach(key => {
        if (active === !integrationIsSupported(key)) return; // put this mapping in the correct section
        let extra = null;
        const mappedKey = integrationMapping(key);
        if (!_.isEmpty(teamIntegrations) && teamIntegrations[mappedKey]) {
          const { expired, revoked } = teamIntegrations[mappedKey];
          if (typeof revoked === 'undefined' || revoked === false) {
            extra = <i className="fa fa-check-circle icon_success habla-green" />;
            if (expired === true) {
              extra = <i className="fa fa-times-circle habla-red" />;
            }
          }
        }
        integrationsArr.push(
          <div key={key}>
            <Tooltip placement="top" title={integrationLabelFromKey(key)}>
              {active ? (
                <Link to={`/app/teamIntegrations/${teamId}/${key}`}>
                  <ImageCard imgSrc={integrationImageFromKey(key)} extra={extra} />
                </Link>
              ) : (
                <ImageCard imgSrc={integrationImageFromKey(key)} extra={extra} />
              )}
            </Tooltip>
            <div className="habla-label align-center-class card-label">{integrationLabelFromKey(key)}</div>
          </div>
        );
      });

      return integrationsArr;
    };

    // const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];
    // if (!subscriberOrg) {
    //   this.props.history.push('/app');
    //   return null;
    // }

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: team.name,
          url: `/app/team/${teamId}`
        },
        {
          title: String.t('integrationsPage.breadcrumb')
        }
      ]
    };

    // Page Menu
    const menuPageHeader = [
      {
        icon: 'fas fa-pencil-alt',
        title: 'TeamPage.editTeam',
        url: `/app/editTeam/${teamId}`
      }
    ];

    return (
      <div>
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          hasMenu
          menuName="settings"
          backButton={`/app/team/${teamId}`}
          menuPageHeader={menuPageHeader}
        />
        <div className="padding-class-a">
          <div className="habla-paragraph">{String.t('integrationsPage.selectIntegration')}</div>
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex habla-integration-list margin-top-class-b">
            <Row type="flex">{renderIntegrations(true)}</Row>
          </SimpleCardContainer>
        </div>
        <div className="padding-class-a border-top-lighter mt-2">
          <div className="habla-paragraph">{String.t('integrationsPage.upcomingIntegrations')}</div>
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex habla-integration-list margin-top-class-b">
            <Row type="flex">{renderIntegrations(false)}</Row>
          </SimpleCardContainer>
        </div>
      </div>
    );
  }
}

TeamIntegrationsPage.propTypes = propTypes;

export default TeamIntegrationsPage;
