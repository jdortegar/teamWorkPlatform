import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { IntegrationsList } from 'src/containers';
import { PageHeader, Spinner } from 'src/components';

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

  render() {
    const { team, integrations } = this.props;
    if (!team || !integrations) return <Spinner />;

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
          backButton
          menuPageHeader={[
            {
              icon: 'fas fa-pencil-alt',
              title: 'TeamPage.editTeam',
              url: `/app/editTeam/${team.teamId}`
            }
          ]}
        />
        <IntegrationsList integrations={integrations} teamId={team.teamId} />
      </div>
    );
  }
}

TeamIntegrationsPage.propTypes = propTypes;

export default TeamIntegrationsPage;
