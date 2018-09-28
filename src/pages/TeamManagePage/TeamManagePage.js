import React, { Component } from 'react';
import { message } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import String from 'src/translations';
import getInitials from 'src/utils/helpers';
import { PageHeader, Spinner, SimpleCardContainer } from 'src/components';
import Avatar from 'src/components/common/Avatar';
import CardView from './CardView';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  fetchTeamMembersByTeamId: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string,
      status: PropTypes.string
    })
  }).isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamMembersPresences: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired
};

class TeamManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = { teamMembersLoaded: false };
  }

  componentDidMount() {
    const { match, teams } = this.props;
    if (!match || !match.params || !teams.teamById[match.params.teamId]) {
      this.props.history.replace('/app');
      return;
    }
    const { teamId, status } = match.params;

    this.props.fetchTeamMembersByTeamId(teamId).then(() => this.setState({ teamMembersLoaded: true }));
    if (status) {
      message.success(messages[status]);
    }
  }

  render() {
    const { match, teams, teamMembers, teamMembersPresences, subscriberOrgById, user } = this.props;
    if (
      match &&
      match.params &&
      match.params.teamId &&
      teams &&
      teams.teamById[match.params.teamId] &&
      teamMembers &&
      teamMembers.length > 0 &&
      teamMembersPresences &&
      subscriberOrgById &&
      this.state.teamMembersLoaded
    ) {
      const { teamId } = match.params;
      const team = teams.teamById[teamId];
      // const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];
      // const teamMemberFoundByUser = _.find(teamMembers, { userId: user.userId });
      // const isAdmin = teamMemberFoundByUser.teams[teamId].role === 'admin';
      const initials = getInitials(team.name);
      const className = classNames({ 'opacity-low': !team.active });
      const subscriberOrgId = this.props.currentSubscriberOrgId;

      // Breadcrumb
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

      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cloud-download-alt',
          title: 'TeamPage.addDataIntegration',
          url: ''
        },
        {
          icon: 'fas fa-pencil-alt',
          title: 'TeamPage.editTeam',
          url: `/app/editTeam/${teamId}`
        }
      ];

      return (
        <div>
          <PageHeader
            subscriberOrgId={subscriberOrgId}
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            menuName="settings"
            backButton={`/app/team/${teamId}`}
            menuPageHeader={menuPageHeader}
          />
          <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
            <Avatar size="x-large" color={team.preferences.iconColor} className={className}>
              {initials}
            </Avatar>
            <div className="margin-top-class-b">
              <h1 className="New-team__title habla-big-title habla-bold-text">{team.name}</h1>
            </div>
            <div className="habla-secondary-paragraph">
              {String.t('TeamPage.teamCreated', { date: moment(team.created).format('LL') })}
            </div>
          </SimpleCardContainer>
          <div className="teamPage-list">
            <CardView
              userId={user.userId}
              team={team}
              teamMembers={teamMembers}
              teamMembersPresences={teamMembersPresences}
            />
          </div>
        </div>
      );
    }
    return <Spinner />;
  }
}

TeamManagePage.propTypes = propTypes;

export default TeamManagePage;
