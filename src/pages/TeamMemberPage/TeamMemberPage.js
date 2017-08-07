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

class TeamMemberPage extends Component {
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

  renderTeamRoomMembers() {
    return this.state.teamRoomMembers.map(({ displayName, userId }) => {
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
    if (this.state.member) {
      const renderProfileCard = (text, url = null) => {
        return (
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={text} />
          </Col>
        );
      };

      return (
        <div>
          <SubpageHeader />
          <SimpleHeader text="Team Member Details" />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderProfileCard('Invite a New Team Room Member', `/`) }
            </Row>
          </SimpleCardContainer>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

TeamMemberPage.propTypes = propTypes;

export default TeamMemberPage;
