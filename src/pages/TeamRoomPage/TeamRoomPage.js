import React, { Component } from 'react';
import _ from 'lodash';
import { Form } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formShape } from '../../propTypes';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import Spinner from '../../components/Spinner';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import UserIcon from '../../components/UserIcon';
import Avatar from '../../components/Avatar';
import PreviewBar from '../../components/PreviewBar';
import Message from '../../components/Message';
import { getJwt, getResourcesUrl } from '../../session';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  form: formShape.isRequired,
  fetchTeamRoomMembersByTeamRoomId: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  fetchTranscript: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.object.isRequired,
  teamRoomMembers: PropTypes.array.isRequired,
  teamRoomMembersObj: PropTypes.object.isRequired,
  teamRoomMembersPresences: PropTypes.object.isRequired,
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
  createMessage: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired
};

const defaultProps = {
  files: []
};


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
      activeLink: String.t('teamRoomPage.all'),
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

    this.props.fetchTeamRoomMembersByTeamRoomId(teamRoomId)
      .then(() => this.setState({
        teamRoomMembersLoaded: true,
        teamRoomMembers: this.props.teamRoomMembers
      }));
    this.props.fetchConversations(teamRoomId)
      .then((response) => {
        if (response.data.conversations) {
          const { conversationId } = response.data.conversations[0];

          this.props.fetchTranscript(conversationId)
            .then(() => this.setState({
              conversationsLoaded: true
            }));
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const nextTeamRoomId = nextProps.match.params.teamRoomId;
    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
    if (this.props.match.params.teamRoomId !== nextTeamRoomId) {
      this.setState({ teamRoomMembersLoaded: false, conversationsLoaded: false });

      this.props.fetchTeamRoomMembersByTeamRoomId(nextTeamRoomId)
        .then(() => this.setState({
          teamRoomMembersLoaded: true,
          teamRoomMembers: this.props.teamRoomMembers
        }));

      this.props.fetchConversations(nextTeamRoomId)
        .then((response) => {
          if (response.data.conversations) {
            const { conversationId } = response.data.conversations[0];

            this.props.fetchTranscript(conversationId)
              .then(() => this.setState({
                conversationsLoaded: true
              }));
          }
          if (response.data === 'STALE') {
            this.setState({
              conversationsLoaded: true
            });
          }
        });
    }
  }

  componentDidUpdate() {
    const chatDiv = document.getElementsByClassName('team-room__messages')[0];
    if (chatDiv && (chatDiv.scrollHeight - chatDiv.scrollTop) < 500) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
    if (chatDiv && chatDiv.scrollTop === 0) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
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
    const fileSource = file.src.split('base64,')[1] || file.src;
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length
      },
      onUploadProgress: (progressEvent) => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${getResourcesUrl()}/${file.name}`, fileSource, requestConfig);
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
              this.props.createMessage(postBody, conversationId);
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
          this.props.createMessage(postBody, conversationId);
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
    const { teamRoomMembers } = this.state;
    const { teamRoomMembersPresences, user } = this.props;

    const members = teamRoomMembers.map(member => ({
      ...member,
      online: _.some(_.values(teamRoomMembersPresences[member.userId]), { presenceStatus: 'online' })
    }));
    const currentUser = _.find(members, { userId: user.userId });
    const otherMembers = _.reject(members, { userId: user.userId });
    const orderedMembers = _.orderBy(otherMembers, ['online', 'firstName', 'lastName', 'displayName'], ['desc', 'asc', 'asc', 'asc']);

    return [currentUser, ...orderedMembers].map(member => (
      <UserIcon
        user={member}
        type="user"
        key={member.userId}
        online={member.online}
      />
    ));
  }

  render() {
    const { teamRoomMembersLoaded, conversationsLoaded } = this.state;
    if (teamRoomMembersLoaded && conversationsLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teamRooms, user, teamRoomMembers } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const teamRoom = teamRooms.teamRoomById[teamRoomId];
      const className = classNames({
        'team-room-chat': true,
        'team-room__main-container--opacity': this.state.isDraggingOver
      });

      const teamRoomMemberFoundByUser = _.find(teamRoomMembers, { userId: user.userId });
      const isAdmin = teamRoomMemberFoundByUser.teamRooms[teamRoomId].role === 'admin';

      const editButton = {
        showButton: true,
        isAdmin,
        url: `/app/editTeamRoom/${teamRoomId}`
      };

      return (
        <div className={className}>

          <div className="team-room__top-page-container">
            <SubpageHeader
              icon={<Avatar
                styles={{ width: '2em', height: '2em' }}
                name={teamRoom.name}
                iconColor={teamRoom.preferences.iconColor}
                image={teamRoom.preferences.avatarBase64 || teamRoom.preferences.logo}
              />}
              breadcrumb={teamRoom.name}
              editButton={editButton}
              node={
                <div className="habla-main-content-filters-links">
                  <div
                    onClick={() => this.handleHeaderClick(String.t('teamRoomPage.all'))}
                    className={`team-room__header-links ${this.state.activeLink === String.t('teamRoomPage.all') ? String.t('teamRoomPage.active') : ''}`}
                  >
                    {String.t('teamRoomPage.all')}
                  </div>
                  <div
                    onClick={() => this.handleHeaderClick(String.t('teamRoomPage.new'))}
                    className={`team-room__header-links ${this.state.activeLink === String.t('teamRoomPage.new') ? String.t('teamRoomPage.active') : ''}`}
                  >
                    {String.t('teamRoomPage.new')}
                  </div>
                  <div
                    onClick={() => this.handleHeaderClick(String.t('teamRoomPage.bookmarked'))}
                    className={`team-room__header-links ${this.state.activeLink === String.t('teamRoomPage.bookmarked') ? String.t('teamRoomPage.active') : ''}`}
                  >
                    {String.t('teamRoomPage.bookmarked')}
                  </div>
                </div>
              }
            />
            <SimpleHeader
              type="node"
              text={
                <div className="team-room__member-cards-container">
                  <span className="team-room__member-cards-span">{String.t('teamRoomPage.membersHeader', { count: numberOfTeamRoomMembers })}</span>
                  {this.renderTeamRoomMembers()}
                </div>
              }
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
                    placeholder={String.t('teamRoomPage.replyPlaceholder')}
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

    return <Spinner />;
  }
}

TeamRoomPage.propTypes = propTypes;
TeamRoomPage.defaultProps = defaultProps;

export default Form.create()(TeamRoomPage);
