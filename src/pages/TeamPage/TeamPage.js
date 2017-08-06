import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';

const propTypes = {
  requestTeamRooms: PropTypes.func.isRequired,
  requestTeamMembers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string
    })
  }).isRequired,
  teamMembers: PropTypes.shape({
    teamMembersByTeamId: PropTypes.shape({
      team: PropTypes.array
    })
  }).isRequired,
  teamRooms: PropTypes.shape({
    teamRoomById: PropTypes.shape({
      teamRoomId: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        teamRoomId: PropTypes.string
      })
    }),
    teamRoomIdsByTeamId: PropTypes.shape({
      ids: PropTypes.array
    })
  }).isRequired
};

class TeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { teamRoomsLoaded: false, teamMembersLoaded: false, teamRooms: [], teamMembers: [] };

    this.handleTeamMemberSearch = this.handleTeamMemberSearch.bind(this);
    this.handleTeamRoomSearch = this.handleTeamRoomSearch.bind(this);
  }
  componentDidMount() {
    const teamId = this.props.match.params.teamId;

    this.props.requestTeamRooms(teamId).then(() => this.setState({ teamRoomsLoaded: true }));
    this.props.requestTeamMembers(teamId).then(() => this.setState({
      teamMembersLoaded: true,
      teamMembers: this.props.teamMembers.teamMembersByTeamId[teamId] }));
  }

  handleTeamRoomSearch(value) {
    const teamId = this.props.match.params.teamId;
    const filteredTeamRooms = this.props.teamRooms.teamRoomIdsByTeamId[teamId].filter((teamRoomId) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRooms: filteredTeamRooms });
  }

  handleTeamMemberSearch(value) {
    const teamId = this.props.match.params.teamId;
    const filteredTeamMembers = this.props.teamMembers.teamMembersByTeamId[teamId].filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamMembers: filteredTeamMembers });
  }

  renderTeamRooms(teamId) {
    const teamRoomsIds = this.props.teamRooms.teamRoomIdsByTeamId[teamId];

    return teamRoomsIds.map((teamRoomId) => {
      const { name } = this.props.teamRooms.teamRoomById[teamRoomId];
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={teamRoomId}>
          <Link to={`/app/teamRoom/${teamRoomId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });
  }

  renderTeamMembers() {
    return this.state.teamMembers.map(({ displayName, userId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={userId}>
          <a>
            <IconCard text={displayName} />
          </a>
        </Col>
      );
    });
  }

  render() {
    const teamId = this.props.match.params.teamId;
    const { teamRooms } = this.props;

    if (this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const numberOfTeamRooms = teamRooms.teamRoomIdsByTeamId[teamId].length;
      const renderAddCard = (text, url = null) => {
        return (
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <Link to={url}>
              <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={text} />
            </Link>
          </Col>
        );
      };

      return (
        <div>
          <SubpageHeader />
          <SimpleHeader text={`Your Team Rooms (${numberOfTeamRooms})`} handleSearch={this.handleTeamRoomSearch} search />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Add a New Team Room', `/`) }
              { this.renderTeamRooms(teamId) }
            </Row>
          </SimpleCardContainer>
          <SimpleHeader text={`Your Team Members (${numberOfTeamRooms})`} handleSearch={this.handleTeamMemberSearch} search />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Invite a New Team Member', `/`) }
              { this.renderTeamMembers() }
            </Row>
          </SimpleCardContainer>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

TeamPage.propTypes = propTypes;

export default TeamPage;
