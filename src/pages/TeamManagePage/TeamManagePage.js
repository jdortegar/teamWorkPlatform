import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import String from 'src/translations';
import getInitials from 'src/utils/helpers';
import { PageHeader, Spinner, SimpleCardContainer } from 'src/components';
import Avatar from 'src/components/common/Avatar';
import CardView from './CardView';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  teamAdminName: PropTypes.string.isRequired,
  orgId: PropTypes.string.isRequired,
  integrations: PropTypes.array.isRequired,
  teamMembers: PropTypes.array.isRequired,
  presences: PropTypes.object.isRequired,
  fetchTeamIntegrations: PropTypes.func.isRequired,
  fetchTeamMembers: PropTypes.func.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired,
  userRoles: PropTypes.object
};

const defaultProps = {
  userRoles: {}
};

class TeamManagePage extends Component {
  state = {
    integrationsLoaded: false,
    teamMembersLoaded: false
  };

  componentDidMount() {
    const { team, history } = this.props;
    if (!team) {
      history.replace('/app');
      return;
    }

    this.props.fetchTeamMembers(team.teamId).then(() => this.setState({ teamMembersLoaded: true }));

    this.props.fetchTeamIntegrations(team.teamId).then(() => {
      this.setState({ integrationsLoaded: true });
    });
  }

  render() {
    const { team, teamMembers, presences, user, integrations, orgId, teamAdminName, users, userRoles } = this.props;
    if (
      !team ||
      !presences ||
      isEmpty(teamMembers) ||
      !this.state.integrationsLoaded ||
      !this.state.teamMembersLoaded
    ) {
      return <Spinner />;
    }

    const { teamId } = team;
    const initials = getInitials(team.name);

    const pageBreadCrumb = {
      routes: [
        {
          title: team.name,
          url: `/app/team/${teamId}`
        },
        {
          title: String.t('TeamPage.manageTeam')
        }
      ]
    };

    const menuPageHeader = [
      {
        icon: 'fas fa-cloud-download-alt',
        title: 'TeamPage.addDataIntegration',
        url: `/app/teamIntegrations/${teamId}`
      },
      {
        icon: 'fas fa-cloud-download-alt',
        title: 'TeamPage.inviteNewMember',
        url: `/app/inviteToTeam/${team.teamId}`
      }
    ];

    if (userRoles.admin || userRoles.teamOwner.length > 0) {
      menuPageHeader.push({
        icon: 'fas fa-pencil-alt',
        title: 'TeamPage.editTeam',
        url: `/app/editTeam/${team.teamId}`
      });
    }

    const className = classNames({ 'opacity-low': !team.active });

    return (
      <div className="TeamSummary">
        <PageHeader
          subscriberOrgId={orgId}
          pageBreadCrumb={pageBreadCrumb}
          hasMenu
          menuName="settings"
          backButton
          menuPageHeader={menuPageHeader}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          {team.preferences.avatarBase64 ? (
            <Avatar
              size="large"
              src={`data:image/jpeg;base64, ${team.preferences.avatarBase64}`}
              className={className}
            />
          ) : (
            <Avatar size="large" color={team.preferences.iconColor} className={className}>
              {initials}
            </Avatar>
          )}
          <div className="margin-top-class-b">
            <h1 className="New-team__title habla-team-title">{team.name}</h1>
          </div>
          <div className="habla-secondary-paragraph">
            {String.t('TeamPage.teamCreated', { date: moment(team.created).format('LL'), teamAdminName })}
          </div>
        </SimpleCardContainer>
        <div className="teamPage-list">
          <CardView
            userId={user.userId}
            team={team}
            integrations={integrations}
            teamMembers={teamMembers}
            presences={presences}
            users={users}
          />
        </div>
      </div>
    );
  }
}

TeamManagePage.propTypes = propTypes;
TeamManagePage.defaultProps = defaultProps;

export default TeamManagePage;
