import React, { Component } from 'react';
import { notification } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import CardView from './CardView';
import ListView from './ListView';
import SubpageHeader from '../../components/SubpageHeader';
import Spinner from '../../components/Spinner';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import messages from './messages';
import Avatar from '../../components/Avatar';
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
  subscriberOrgById: PropTypes.string.isRequired,
  teams: PropTypes.array.isRequired,
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

    this.props.fetchTeamRoomsByTeamId(teamId).then(() => this.setState({
      teamRoomsLoaded: true
      // teamRooms: this.props.teamRooms // TODO: JC, don't need to do this.  It's already set in the containers mapStateToProps. Remove comment after you read this.
    }));
    this.props.fetchTeamMembersByTeamId(teamId).then(() => this.setState({
      teamMembersLoaded: true
      // teamMembers: this.props.teamMembers // TODO: JC, don't need to do this.  It's already set in the containers mapStateToProps. Remove comment after you read this.
    }));
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
    const teamId = this.props.match.params.teamId;
    const { teamRooms, teams, teamMembers, subscriberOrgById, user } = this.props;
    if (this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const team = teams.teamById[teamId];
      const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];
      const teamMemberFoundByUser = _.find(teamMembers, { userId: user.userId });
      const isAdmin = teamMemberFoundByUser.teams[teamId].role === 'admin';
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
            <Avatar
              styles={{ width: '4em', height: '4em', margin: '0 auto' }}
              name={team.name}
              iconColor={team.preferences.iconColor}
              image={team.preferences.avatarBase64 || team.preferences.logo}
            />
            <h1 className="New-team__title habla-big-title habla-bold-text margin-top-class-b">
              {team.name}
              <div className="habla-main-content-item-signal habla-color-green" />
            </h1>
            <div className="habla-secondary-paragraph margin-top-class-b">
              Created on November 27, 2017 by Mike Somlo
            </div>
          </SimpleCardContainer>
          <div className="teamPage-list">
            {
              this.state.view === 'card' ?
                <CardView
                  userId={user.userId}
                  teamId={teamId}
                  teamRooms={teamRooms}
                  teamMembers={teamMembers}
                  onSwitchView={() => this.setState({ view: 'list' })}
                /> :
                <ListView
                  teamId={teamId}
                  teamRooms={teamRooms}
                  teamMembers={teamMembers}
                  onSwitchView={() => this.setState({ view: 'card' })}
                />
            }
          </div>
        </div>
      );
    }
    return <Spinner />;
  }
}

TeamPage.propTypes = propTypes;

export default TeamPage;
