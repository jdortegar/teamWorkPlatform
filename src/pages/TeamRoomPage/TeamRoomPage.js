  import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';

const propTypes = {
  requestTeamRoomMembers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  teamRoomMembers: PropTypes.shape({
    teamRoomMembersByTeamRoomId: PropTypes.object
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

class TeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = { teamRoomMembersLoaded: false, teamRoomMembers: [] };

    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    const teamRoomId = this.props.match.params.teamRoomId;

    this.props.requestTeamRoomMembers(teamRoomId)
      .then(() => this.setState({
        teamRoomMembersLoaded: true,
        teamRoomMembers: this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId]
      }));
  }

  handleSearch(value) {
    const teamRoomId = this.props.match.params.teamRoomId;
    const filteredTeamMembers = this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId].filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRoomMembers: filteredTeamMembers });
  }

  renderTeamRoomMembers() {
    return this.state.teamRoomMembers.map(({ displayName, userId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={userId}>
          <Link to={`/app/member/${userId}`}>
            <IconCard text={displayName} />
          </Link>
        </Col>
      );
    });
  }

  render() {
    if (this.state.teamRoomMembersLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teams, teamRooms, subscriberOrgById } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const { teamId, name } = teamRooms.teamRoomById[teamRoomId];
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
          <SubpageHeader breadcrumb={
            <div>
              <span className="breadcrumb_underline">{subscriberOrgName}</span> /
              <span className="breadcrumb_underline">{teamName}</span> /
              {name}
            </div>}
          />
          <SimpleHeader text={`Team Room (${numberOfTeamRoomMembers} members)`} handleSearch={this.handleSearch} search />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Invite a New Team Room Member', '/') }
              { this.renderTeamRoomMembers() }
            </Row>
          </SimpleCardContainer>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

TeamRoomPage.propTypes = propTypes;

export default TeamRoomPage;
