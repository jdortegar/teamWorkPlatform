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
  teamMembers: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired
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

    this.props.requestTeamRooms(teamId).then(() => this.setState({
      teamRoomsLoaded: true,
      teamRooms: this.props.teamRooms
    }));
    this.props.requestTeamMembers(teamId).then(() => this.setState({
      teamMembersLoaded: true,
      teamMembers: this.props.teamMembers
    }));
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

  renderTeamRooms() {
    return this.state.teamRooms.map(({ name, teamRoomId }) => {
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
    const { teamRooms, teams, subscriberOrgById } = this.props;

    if (this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const numberOfTeamRooms = teamRooms.length;
      const teamName = teams.teamById[teamId].name;
      const subscriberOrgName = subscriberOrgById[teams.teamById[teamId].subscriberOrgId].name;
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
          <SubpageHeader breadcrumb={<div><span className="breadcrumb_underline">{subscriberOrgName}</span> / {teamName}</div>} />
          <SimpleHeader text={`Your Team Rooms (${numberOfTeamRooms})`} handleSearch={this.handleTeamRoomSearch} search />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Add a New Team Room', `/`) }
              { this.renderTeamRooms() }
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
