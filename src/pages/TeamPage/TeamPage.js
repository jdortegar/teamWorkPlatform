import React, { Component } from 'react';
import { Tooltip, notification } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import CardView from './CardView';
import String from '../../translations';
import SubpageHeader from '../../components/SubpageHeader';
import Spinner from '../../components/Spinner';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import messages from './messages';
import Avatar from '../../components/common/Avatar';
import getInitials from '../../utils/helpers';
import './styles/style.css';

const propTypes = {
  fetchTeamRoomsByTeamId: PropTypes.func.isRequired,
  fetchTeamMembersByTeamId: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string,
      status: PropTypes.string
    })
  }).isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

class TeamPage extends Component {
  constructor(props) {
    super(props);

    // this.state = { teamRoomsLoaded: false, teamMembersLoaded: false, teamRooms: [], teamMembers: [], view: 'card' };
    this.state = { teamRoomsLoaded: false, teamMembersLoaded: false, view: 'card' };

    this.handleTeamMemberSearch = this.handleTeamMemberSearch.bind(this);
    this.handleTeamRoomSearch = this.handleTeamRoomSearch.bind(this);
  }

  componentDidMount() {
    const { teamId, status } = this.props.match.params;

    this.props.fetchTeamRoomsByTeamId(teamId).then(() => this.setState({ teamRoomsLoaded: true }));
    this.props.fetchTeamMembersByTeamId(teamId).then(() => this.setState({ teamMembersLoaded: true }));
    if (status) {
      notification.open({
        message: messages.success,
        description: messages[status],
        duration: 4
      });
    }
  }

  handleTeamRoomSearch(value) {
    const filteredTeamRooms = this.props.teamRooms.filter(({ name }) => {
      return name.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRooms: filteredTeamRooms });
  }

  handleTeamMemberSearch(value) {
    const filteredTeamMembers = this.props.teamMembers.filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamMembers: filteredTeamMembers });
  }

  render() {
    const { match, teamRooms, teams, teamMembers, subscriberOrgById, user } = this.props;
    if (teamRooms && match && match.params && match.params.teamId &&
        teamRooms && teams && teamMembers && subscriberOrgById &&
        this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const teamId = match.params.teamId;
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
      return (
        <div>
          <SubpageHeader
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
            <Avatar size="x-large" color={team.preferences.iconColor}>{initials}</Avatar>
            <div className="margin-top-class-b">
              <h1 className="New-team__title habla-big-title habla-bold-text">
                {team.name}
                <Tooltip placement="top" title={String.t('TeamPage.activeStatus')}>
                  <div className="habla-main-content-item-signal habla-color-green" />
                </Tooltip>
              </h1>
            </div>
            <div className="habla-secondary-paragraph margin-top-class-b">
              Created on November 27, 2017 by Mike Somlo
            </div>
          </SimpleCardContainer>
          <div className="teamPage-list">
            <CardView
              userId={user.userId}
              teamId={teamId}
              teamRooms={teamRooms}
              teamMembers={teamMembers}
              onSwitchView={() => this.setState({ view: 'list' })}
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
