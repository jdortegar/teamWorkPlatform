import React, { Component } from 'react';
import { Row, Col, notification } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CardView from './CardView';
import ListView from './ListView';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import EditButton from '../../components/buttons/EditButton';
import messages from './messages';
import UserIcon from '../../components/UserIcon';

const propTypes = {
  requestTeamRooms: PropTypes.func.isRequired,
  requestTeamMembers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string
    })
  }).isRequired,
  teamMembers: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired,
  teams: PropTypes.object.isRequired
};

class TeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { teamRoomsLoaded: false, teamMembersLoaded: false, teamRooms: [], teamMembers: [], view: 'card' };

    this.handleTeamMemberSearch = this.handleTeamMemberSearch.bind(this);
    this.handleTeamRoomSearch = this.handleTeamRoomSearch.bind(this);
  }
  componentDidMount() {
    const { teamId, status } = this.props.match.params;

    this.props.requestTeamRooms(teamId).then(() => this.setState({
      teamRoomsLoaded: true,
      teamRooms: this.props.teamRooms
    }));
    this.props.requestTeamMembers(teamId).then(() => this.setState({
      teamMembersLoaded: true,
      teamMembers: this.props.teamMembers
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
    const { teamRooms, teams, teamMembers, subscriberOrgById } = this.props;

    if (this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const team = teams.teamById[teamId];
      const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];

      return (
        <div>
          <SubpageHeader
            icon={<UserIcon user={team} type="team" clickable={false} />}
            breadcrumb={
              <div>
                <Link to={`/app/organization/${subscriberOrg.subscriberOrgId}`}>
                  <span className="breadcrumb_underline">{subscriberOrg.name}</span>
                </Link> / {team.name}
              </div>
            }
          />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
                <UploadImageField text={'Upload Avatar'} />
              </Col>
              <Col xs={{ span: 20 }} sm={{ span: 13 }} md={{ span: 16 }}>
                <div className="New-team__container">
                  <h1 className="New-team__title">{team.name}</h1>
                </div>
              </Col>
              <Col xs={{ span: 4 }} sm={{ span: 3 }} md={{ span: 3 }}>
                <EditButton url={`/app/editTeam/${teamId}`} />
              </Col>
            </Row>
          </SimpleCardContainer>
          {
            this.state.view === 'card' ?
              <CardView
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
      );
    }

    return <div>Loading...</div>;
  }
}

TeamPage.propTypes = propTypes;

export default TeamPage;
