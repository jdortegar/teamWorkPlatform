import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PageHeader, SimpleCardContainer, ImageCard } from 'src/components';
import String from 'src/translations';
import {
  integrationImageFromKey,
  integrationLabelFromKey,
  // integrationConfigFromKey,
  integrationMapping
} from 'src/utils/dataIntegrations';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired,
      integrationDetails: PropTypes.string.isRequired,
      status: PropTypes.string
    }).isRequired
  }).isRequired,
  teams: PropTypes.object.isRequired,
  integrations: PropTypes.array.isRequired
};

function determineStatus(integration) {
  // debugger;
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

class TeamIntegrationDetailsPage extends Component {
  componentDidMount() {
    // const { match, subscriberOrgs } = this.props;
  }

  render() {
    // const
    // debugger;
    const { match, teams, integrations } = this.props;
    const { integrationDetails, teamId } = match.params;
    const team = teams[teamId];

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: team.name,
          url: `/app/team/${teamId}`
        },
        {
          title: String.t('integrationDetailsPage.integrations')
        }
      ]
    };

    const integrationKey = integrationMapping(integrationDetails);
    const integration = integrations[integrationKey];
    const imgSrc = integrationImageFromKey(integrationKey);
    const name = integrationLabelFromKey(integrationKey);
    const currStatus = determineStatus(integration);

    return (
      <div>
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          hasMenu={false}
          menuName="settings"
          backButton={`/app/team/${teamId}`}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="Integration-details__icon-container">
            <ImageCard imgSrc={imgSrc} size="large" />
          </div>
          <div className="habla-big-title habla-bold-text">{name}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{currStatus}</div>
        </SimpleCardContainer>
      </div>
    );
  }
}

TeamIntegrationDetailsPage.propTypes = propTypes;

export default TeamIntegrationDetailsPage;
