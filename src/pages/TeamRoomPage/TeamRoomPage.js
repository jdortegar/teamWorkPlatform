import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formShape } from '../../propTypes';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import UserIcon from '../../components/UserIcon';
import PreviewBar from '../../components/PreviewBar';
import Message from '../../components/Message';
import { getJwt, getResourcesUrl } from '../../session';
import config from '../../config/env';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  form: formShape.isRequired,
  requestTeamRoomMembers: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  requestTranscript: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.object.isRequired,
  teamRoomMembers: PropTypes.array.isRequired,
  teamRoomMembersObj: PropTypes.object.isRequired,
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
  }).isRequired,
  conversations: PropTypes.shape({
    conversationId: PropTypes.string.isRequired,
    transcript: PropTypes.array
  }).isRequired,
  updateFileList: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  requestConversations: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired
};

const defaultProps = {
  files: []
};

const resourceUrl = getResourcesUrl();


function createMessage(conversationId, postBody) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return axios.post(
    `${config.hablaApiBaseUri}/conversations/${conversationId}/createMessage`,
    postBody,
    axiosOptions);
}

function getPercentOfRequest(total, loaded) {
  const percent = (loaded * 100) / total;
  return Math.round(percent);
}

class TeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamRoomMembersLoaded: false,
      conversationsLoaded: false,
      teamRoomMembers: [],
      activeLink: messages.all,
      replyTo: null,
      showPreviewBox: false,
      barPercent: 0,
      file: null
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onReplyTo = this.onReplyTo.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
    if (this.props.match.params.teamRoomId !== nextProps.match.params.teamRoomId) {
      this.setState({ teamRoomMembersLoaded: false, conversationsLoaded: false });
      nextProps.requestTeamRoomMembers(nextProps.match.params.teamRoomId)
        .then(() => this.setState({
          teamRoomMembersLoaded: true,
          teamRoomMembers: nextProps.teamRoomMembers
        }));
      nextProps.requestConversations(nextProps.match.params.teamRoomId)
        .then((data) => {
          if (data.payload.conversations) {
            const { conversationId } = data.payload.conversations[0];

            nextProps.requestTranscript(conversationId)
              .then(() => this.setState({
                conversationsLoaded: true
              }));
          }
        });
    }
  }

  onCancelReply() {
    if (this.props.files.length > 0) {
      this.props.clearFileList();
    }
    this.setState({ replyTo: null, showPreviewBox: false });
  }

  onReplyTo(replyObj) {
    this.setState({ showPreviewBox: true, replyTo: replyObj });
  }

  onFileChange(event) {
    const { files } = event.target;
    if (files) {
      this.props.updateFileList(files);
      this.setState({ showPreviewBox: true });
    }
  }

  createResource(file) {
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        'Content-Type': file.type,
        'x-hablaai-content-length': file.src.length,
      },
      onUploadProgress: (progressEvent) => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${resourceUrl}/${file.name}`, file.src, requestConfig);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { conversationId } = this.props.conversations;
        const postBody = { content: [] };
        const { message } = values;

        this.props.form.resetFields();

        if (this.props.files && this.props.files.length > 0) {
          const resources = this.props.files.map(file => this.createResource(file));
          Promise.all(resources)
            .then((res) => {
              postBody.content = res.map((createdResource, index) => {
                return {
                  type: this.props.files[index].type,
                  resourceId: createdResource.data.resourceId,
                  meta: {
                    fileName: this.props.files[index].name,
                    fileSize: this.props.files[index].size,
                    lastModified: this.props.files[index].lastModifiedDate
                  }
                };
              });
              if (message) {
                postBody.content.push({ type: 'text/plain', text: message });
              }
              if (this.state.replyTo) {
                const { messageId } = this.state.replyTo;
                postBody.replyTo = messageId;
                this.setState({ replyTo: null, showPreviewBox: false });
              }
              createMessage(conversationId, postBody);
              this.setState({ showPreviewBox: false, file: null });
              this.props.clearFileList();
            });
        } else if (message) {
          postBody.content.push({ type: 'text/plain', text: message });
          if (this.state.replyTo) {
            const { messageId } = this.state.replyTo;
            postBody.replyTo = messageId;
            this.setState({ replyTo: null, showPreviewBox: false });
          }
          createMessage(conversationId, postBody);
        }
      }
    });
  }

  handleHeaderClick(value) {
    this.setState({ activeLink: value });
  }

  handleSearch(value) {
    const teamRoomId = this.props.match.params.teamRoomId;
    const filteredTeamMembers = this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId].filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRoomMembers: filteredTeamMembers });
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
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
          hide={false}
          teamRoomMembersObj={this.props.teamRoomMembersObj}
          onFileChange={this.onFileChange}
        />
      );
    });
  }

  renderTeamRoomMembers() {
    return this.state.teamRoomMembers.map((user) => {
      return (
        <UserIcon user={user} type="user" key={user.userId} />
      );
    });
  }

  render() {
    if (this.state.teamRoomMembersLoaded && this.state.conversationsLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teamRooms, user } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const teamRoom = teamRooms.teamRoomById[teamRoomId];
      const teamRoomMembers = this.renderTeamRoomMembers();
      const className = classNames({
        'team-room-chat': true,
        'team-room__main-container--opacity': this.state.isDraggingOver
      });
      const messages = this.props.conversations.transcript;

      return (
        <div className={className}>

          <div className="team-room__top-page-container">
            <SubpageHeader
              icon={<UserIcon user={teamRoom} type="team" clickable={false} />}
              breadcrumb={teamRoom.name}
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
              type="node"
              text={
                <div className="team-room__member-cards-container">
                  <span className="team-room__member-cards-span">{numberOfTeamRoomMembers} members</span>
                  {teamRoomMembers}
                </div>
              }
              handleSearch={this.handleSearch}
              search
            />
          </div>

          <SimpleCardContainer className="team-room__messages">
            {this.renderMessages()}
          </SimpleCardContainer>

          <SimpleCardContainer className="team-room__chat-container">
            { this.state.showPreviewBox &&
              <PreviewBar
                files={this.props.files}
                fileWithPercent={this.state.file}
                updateFiles={this.updateFiles}
                removeFileFromList={this.props.removeFileFromList}
                onCancelReply={this.onCancelReply}
                addBase={this.props.addBase}
                replyTo={this.state.replyTo}
                user={user}
                isDraggingOver={this.props.isDraggingOver}
              />
            }
            <div className="team-room__chat-input">
              <div className="team-room__chat-input__image-wrapper">
                <UserIcon user={user} type="user" minWidth="2.5em" width="2.5em" height="2.5em" key={user.userId} />
              </div>
              <div className="team-room__chat-input-wrapper">
                <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
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
              </div>
              <div className="team-room__chat-col-icons">
                <a className="team-room__icons" role="button" tabIndex={0} onClick={this.handleSubmit}>
                  <i className="fa fa-paper-plane-o" />
                </a>
                <div>
                  <input
                    id="fileupload"
                    className="team-room__file-upload-input"
                    type="file"
                    onChange={this.onFileChange}
                    multiple
                  />
                  <label htmlFor="fileupload" className="team-room__icons"><i className="fa fa-folder-o" /></label>
                </div>
              </div>
            </div>

          </SimpleCardContainer>

        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

TeamRoomPage.propTypes = propTypes;
TeamRoomPage.defaultProps = defaultProps;

export default Form.create()(TeamRoomPage);
