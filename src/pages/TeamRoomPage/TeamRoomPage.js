import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { formShape } from '../../propTypes';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import UserIcon from '../../components/UserIcon';
import Message from '../../components/Message';
import { getJwt } from '../../session';
import config from '../../config/env';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
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

    this.state = {
      teamRoomMembersLoaded: false,
      conversationsLoaded: false,
      teamRoomMembers: [],
      activeLink: messages.all,
      replyTo: null
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onReplyTo = this.onReplyTo.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      .then((data) => {
        if (data.payload.conversations) {
          const { conversationId } = data.payload.conversations[0];

          this.props.requestTranscript(conversationId)
            .then(() => this.setState({
              conversationsLoaded: true
            }));
        }
      });
  }

  handleSearch(value) {
    const teamRoomId = this.props.match.params.teamRoomId;
    const filteredTeamMembers = this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId].filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRoomMembers: filteredTeamMembers });
  }

  handleHeaderClick(value) {
    this.setState({ activeLink: value });
  }

  onCancelReply() {
    this.setState({ replyTo: null });
  }

  onReplyTo(replyObj) {
    this.setState({ replyTo: replyObj });
  }

  renderMessages() {
    return this.props.conversations.transcript.map((message) => {
      const user = this.props.teamRoomMembersObj[message.createdBy];
      return (
        <Message
          message={message}
          user={user}
          key={message.messageId}
          replyTo={this.onReplyTo}
        />
      );
    });
  }

  renderTeamRoomMembers() {
    return this.state.teamRoomMembers.map(({ firstName, lastName, icon, preferences, userId }) => {
      if (!icon) {
        const name = `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`;
        const title = `${firstName} ${lastName}`;
        return (
          <UserIcon key={userId} name={name} bgColor={preferences.iconColor} title={title} />
        );
      }

      return (
        <UserIcon />
      );
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
        const { conversationId } = this.props.conversations;
        const { message } = values;
        const postBody = { messageType: 'text', text: message };

        if (this.state.replyTo) {
          const { messageId } = this.state.replyTo;
          postBody.replyTo = messageId;
          this.setState({ replyTo: null });
        }

        this.props.form.resetFields();

        axios.post(
          `${config.hablaApiBaseUri}/conversations/${conversationId}/createMessage`,
          postBody,
          axiosOptions);
      }
    });
  }

  render() {
    if (this.state.teamRoomMembersLoaded && this.state.conversationsLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teamRooms } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const { name } = teamRooms.teamRoomById[teamRoomId];
      const teamRoomMembers = this.renderTeamRoomMembers();
      console.log(this.props);

      return (
        <div>
          <SubpageHeader
            breadcrumb={name}
            node={
              <div className="team-room__header-container">
                <div className={`team-room__header-links ${this.state.activeLink === messages.all ? 'active' : ''}`}>
                  <a onClick={() => this.handleHeaderClick(messages.all)}>{messages.all}</a>
                </div>
                <div className={`team-room__header-links ${this.state.activeLink === messages.new ? 'active' : ''}`}>
                  <a onClick={() => this.handleHeaderClick(messages.new)}>{messages.new}</a>
                </div>
                <div className={`team-room__header-links ${this.state.activeLink === messages.bookmarked ? 'active' : ''}`}>
                  <a onClick={() => this.handleHeaderClick(messages.bookmarked)}>{messages.bookmarked}</a>
                </div>
              </div>
            }
          />
          <SimpleHeader
            type="cards"
            text={
              <div className="team-room__member-cards-container">
                <span className="team-room__member-cards-span">{numberOfTeamRoomMembers} members</span>
                {teamRoomMembers}
              </div>
            }
            handleSearch={this.handleSearch}
            search
          />
          <SimpleCardContainer>
            {this.renderMessages()}
          </SimpleCardContainer>
          <SimpleCardContainer className="subpage-block team-room__chat-container">
            {
              this.state.replyTo ?
                <Row type="flex" justify="start" align="middle" gutter={20} className="team-room__message_reply-container">
                  <Col xs={{ span: 20 }}>
                    <p className="team-room__message-body-name">{this.state.replyTo.firstName} {this.state.replyTo.lastName}</p>
                    <p className="team-room__message-body-text">
                      {this.state.replyTo.text}
                    </p>
                  </Col>
                  <Col xs={{ span: 4 }}>
                    <a className="team-room__message-cancel-reply" onClick={this.onCancelReply} title={messages.cancel}>
                      <i className="fa fa-times-circle-o" />
                    </a>
                  </Col>
                </Row> : null
            }
            <Row type="flex" justify="start" align="middle" gutter={20} className="team-room__chat-input">
              <Col xs={{ span: 2 }} className="team-room__chat-input-col">
                Hey
              </Col>
              <Col xs={{ span: 20 }} className="team-room__chat-input-col">
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <TextField
                    componentKey="message"
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
