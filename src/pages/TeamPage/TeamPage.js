import React, { Component } from 'react';
import { message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import String from 'src/translations';
import getInitials from 'src/utils/helpers';
import { BreadCrumb, SubpageHeader, Spinner, SimpleCardContainer } from 'src/components';
import Avatar from 'src/components/common/Avatar';
import CardView from './CardView';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  fetchTeamRoomsByTeamId: PropTypes.func.isRequired,
  fetchTeamMembersByTeamId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string,
      status: PropTypes.string
    })
  }).isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamMembersPresences: PropTypes.object.isRequired,
  teamRooms: PropTypes.array.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = { teamRoomsLoaded: false, teamMembersLoaded: false };
  }

  componentDidMount() {
    const { match, teams } = this.props;
    if (!match || !match.params || !teams.teamById[match.params.teamId]) {
      this.props.history.replace('/app');
      return;
    }
    const { teamId, status } = match.params;

    this.props.fetchTeamRoomsByTeamId(teamId).then(() => this.setState({ teamRoomsLoaded: true }));
    this.props.fetchTeamMembersByTeamId(teamId).then(() => this.setState({ teamMembersLoaded: true }));
    if (status) {
      message.success(messages[status]);
    }
  }

  render() {
    const { match, teamRooms, teams, teamMembers, teamMembersPresences, subscriberOrgById, user } = this.props;
    if (
      teamRooms &&
      match &&
      match.params &&
      match.params.teamId &&
      teamRooms &&
      teams &&
      teams.teamById[match.params.teamId] &&
      teamMembers &&
      teamMembers.length > 0 &&
      teamMembersPresences &&
      subscriberOrgById &&
      this.state.teamMembersLoaded &&
      this.state.teamRoomsLoaded
    ) {
      const { teamId } = match.params;
      const team = teams.teamById[teamId];
      const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];
      const teamMemberFoundByUser = _.find(teamMembers, { userId: user.userId });
      const isAdmin = teamMemberFoundByUser.teams[teamId].role === 'admin';
      const initials = getInitials(team.name);
      const editButton = {
        showButton: true,
        isAdmin,
        url: `/app/editTeam/${teamId}`
      };
      const className = classNames({ 'opacity-low': !team.active });
      return (
        <div>
          <SubpageHeader
            subscriberOrgId={subscriberOrg.subscriberOrgId}
            ckgLink={{ teamId }}
            history={this.props.history}
            breadcrumb={
              <BreadCrumb
                subscriberOrg={subscriberOrg}
                routes={[
                  {
                    title: subscriberOrg.name,
                    link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                  },
                  { title: team.name }
                ]}
              />
            }
            editButton={editButton}
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
              teamRooms={teamRooms}
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

TeamPage.propTypes = propTypes;

export default TeamPage;
