import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import CardView from './CardView';
import ListView from './ListView';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import EditButton from '../../components/buttons/EditButton';

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

    this.state = { teamRoomsLoaded: false, teamMembersLoaded: false, teamRooms: [], teamMembers: [], view: 'card' };

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

  render() {
    const teamId = this.props.match.params.teamId;
    const { teamRooms, teams, teamMembers, subscriberOrgById } = this.props;

    if (this.state.teamMembersLoaded && this.state.teamRoomsLoaded) {
      const teamName = teams.teamById[teamId].name;
      const subscriberOrgName = subscriberOrgById[teams.teamById[teamId].subscriberOrgId].name;

      return (
        <div>
          <SubpageHeader breadcrumb={<div><span className="breadcrumb_underline">{subscriberOrgName}</span> / {teamName}</div>} />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
                <UploadImageField text={'Upload Avatar'} />
              </Col>
              <Col xs={{ span: 20 }} sm={{ span: 13 }} md={{ span: 16 }}>
                <div className="New-team__container">
                  <h1 className="New-team__title">{teamName}</h1>
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
