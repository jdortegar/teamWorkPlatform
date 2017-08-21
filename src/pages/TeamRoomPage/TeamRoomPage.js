import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import UserIcon from '../../components/UserIcon';
import { IconCard } from '../../components/cards';
import { getJwt } from '../../session';
import './styles/style.css';

const propTypes = {
  requestTeamRoomMembers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  teamRoomMembers: PropTypes.array.isRequired,
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

    this.state = { teamRoomMembersLoaded: false, conversationsLoaded: false, conversations: [], teamRoomMembers: [] };

    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    const teamRoomId = this.props.match.params.teamRoomId;

    this.props.requestTeamRoomMembers(teamRoomId)
      .then(() => this.setState({
        teamRoomMembersLoaded: true,
        teamRoomMembers: this.props.teamRoomMembers
      }));
    this.props.requestConversations(teamRoomId)
      .then(data => {
        const { conversationId } = data.payload.conversations[0];
        console.log(conversationId);

        this.props.requestTranscript(conversationId)
          .then(() => this.setState({
            conversationsLoaded: true,
            conversations: this.props.conversations
          }));
      });
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
    if (this.state.teamRoomMembersLoaded && this.state.conversationsLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teamRooms } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const { name } = teamRooms.teamRoomById[teamRoomId];

      console.log(this.props);

      return (
        <div>
          <SubpageHeader breadcrumb={
            <div>
              {name}
            </div>}
          />
          <SimpleHeader
            type="cards"
            text={<UserIcon />}
            handleSearch={this.handleSearch}
            search
          />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              <Col xs={{ span: 2 }}>
                Hey
              </Col>
              <Col xs={{ span: 19 }}>
                Mommy
              </Col>
              <Col xs={{ span: 3 }} className="team-room__chat-col-icons">
                <a className="team-room__icons"><i className="fa fa-reply" /></a>
                <a className="team-room__icons"><i className="fa fa-folder-o" /></a>
                <a className="team-room__icons"><i className="fa fa-bookmark-o" /></a>
                <a className="team-room__icons"><i className="fa fa-circle-thin" /></a>
              </Col>
            </Row>
          </SimpleCardContainer>
          <SimpleCardContainer className="subpage-block team-room__chat-container">
            <Row type="flex" justify="start" align="middle" gutter={20} className="team-room__chat-input">
              <Col xs={{ span: 2 }} className="team-room__chat-input-col">
                Hey
              </Col>
              <Col xs={{ span: 20 }} className="team-room__chat-input-col">
                <Form className="login-form">
                  <TextField
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder="Leave a reply..."
                    label=""
                    className="team-room__chat-input-form-item"
                    inputClassName="team-room__chat-input-textfield"
                  />
                </Form>
              </Col>
              <Col xs={{ span: 2 }} className="team-room__chat-input-col team-room__chat-col-icons">
                <a className="team-room__icons"><i className="fa fa-paper-plane-o" /></a>
                <a className="team-room__icons"><i className="fa fa-folder-o" /></a>
              </Col>
            </Row>
          </SimpleCardContainer>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

TeamRoomPage.propTypes = propTypes;

export default Form.create()(TeamRoomPage);
