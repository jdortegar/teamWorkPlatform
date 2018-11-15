import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import classNames from 'classnames';
import { formShape } from 'src/propTypes';
import { Form, Tooltip, message as msg } from 'antd';
import {
  PageHeader,
  SimpleCardContainer,
  Spinner,
  AvatarWrapper,
  PreviewBar,
  TextField,
  Message
} from 'src/components';
import { messageAction } from 'src/components/Message/Message';
import { sortByFirstName } from 'src/redux-hablaai/selectors/helpers';
import String from 'src/translations';
import axios from 'axios';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  fetchTeamMembers: PropTypes.func.isRequired,
  unreadMessagesCount: PropTypes.number,
  files: PropTypes.array,
  removeFileFromList: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  form: formShape.isRequired,
  token: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string.isRequired,
  createMessage: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  conversations: PropTypes.shape({
    conversationId: PropTypes.string.isRequired,
    transcript: PropTypes.array
  }),
  fetchTranscript: PropTypes.func.isRequired,
  saveBookmark: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  membersTyping: PropTypes.object,
  iAmTyping: PropTypes.func.isRequired,
  readMessage: PropTypes.func.isRequired,
  showPageHeader: PropTypes.bool,
  showTeamMembers: PropTypes.bool,
  showChat: PropTypes.func,
  menuOptions: PropTypes.array
};

const defaultProps = {
  conversations: {},
  unreadMessagesCount: 0,
  files: [],
  membersTyping: null,
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null,
  menuOptions: []
};

function getPercentOfRequest(total, loaded) {
  const percent = (loaded * 100) / total;
  return Math.round(percent);
}

const BOTTOM_SCROLL_LIMIT = 200;

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: null,
      teamMembersLoaded: false,
      conversationsLoaded: false,
      showPreviewBox: false,
      replyTo: null,
      lastSubmittedMessage: null,
      file: null
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onMessageAction = this.onMessageAction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.typingTimer = null;
  }

  componentDidMount() {
    const { team } = this.props;

    this.props.fetchTeamMembers(team.teamId).then(() => {
      // Get members data form Users
      const { teamMembers, users, usersPresences } = this.props;
      const members = teamMembers.map(memberId => {
        const member = users[memberId];
        return {
          ...member,
          online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
        };
      });

      this.setState({ teamMembersLoaded: true, members });
    });

    this.props.fetchConversations(team.teamId).then(response => {
      if (response.data.conversations) {
        const { conversationId } = response.data.conversations[0];

        this.props
          .fetchTranscript(conversationId)
          .then(() =>
            this.setState({
              conversationsLoaded: true
            })
          )
          .then(this.scrollToBottom);
      }
      if (response.data === 'STALE') {
        this.setState({
          conversationsLoaded: true
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextTeamId = nextProps.team.teamId;

    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
    if (this.props.team.teamId !== nextTeamId) {
      this.setState({ teamMembersLoaded: false, conversationsLoaded: false });

      this.props.fetchTeamMembers(nextTeamId).then(() => {
        const { teamMembers, users, usersPresences } = this.props;
        const members = teamMembers.map(memberId => {
          const member = users[memberId];
          return {
            ...member,
            online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
          };
        });

        this.setState({
          teamMembersLoaded: true,
          members
        });
      });

      this.props.fetchConversations(nextTeamId).then(response => {
        if (response.data.conversations) {
          const { conversationId } = response.data.conversations[0];

          this.props.fetchTranscript(conversationId).then(() =>
            this.setState({
              conversationsLoaded: true
            })
          );
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { conversations, user } = this.props;
    if (!prevProps.conversations || !conversations) return;
    if (prevProps.conversations.transcript.length === conversations.transcript.length) return;

    const ownMessage = _.last(conversations.transcript).createdBy === user.userId;
    if (ownMessage || this.isNearBottom()) this.scrollToBottom();
  }

  onCancelReply() {
    if (this.props.files.length > 0) {
      this.props.clearFileList();
    }
    this.setState({ replyTo: null, showPreviewBox: false });
  }

  onMessageAction(payload, action) {
    const { message, bookmark, extraInfo } = payload;
    const { user, orgId } = this.props;

    switch (action) {
      case messageAction.replyTo:
        this.setState({ showPreviewBox: true, replyTo: extraInfo });
        break;
      case messageAction.bookmark:
        this.props
          .saveBookmark(user, orgId, bookmark, extraInfo.setBookmark)
          .then(() => {
            msg.success(String.t(extraInfo.setBookmark ? 'message.bookmarkSetToast' : 'message.bookmarkRemovedToast'));
          })
          .catch(error => {
            msg.error(error.message);
          });
        break;
      case messageAction.delete:
        this.props
          .deleteMessage(message.messageId, message.conversationId)
          .then(() => {
            msg.success(String.t('message.deleteSuccessToast'));
          })
          .catch(error => {
            msg.error(error.message);
          });
        break;
      default:
        break;
    }
  }

  onFileChange(event) {
    const { files } = event.target;
    if (files) {
      this.props.updateFileList(files);
      this.setState({ showPreviewBox: true });
    }
  }

  isNearBottom = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
  };

  scrollToBottom = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      messagesContainer.scrollTop = scrollHeight;
    }
  };

  handleTyping = () => {
    const { conversationId } = this.props.conversations;
    this.clearTypingTimer();
    this.typingTimer = setTimeout(this.stopTyping, 5000);
    this.props.iAmTyping(conversationId, true);
  };

  stopTyping = () => {
    const { conversationId } = this.props.conversations;
    this.props.iAmTyping(conversationId, false);
  };

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  };

  scrollToBottom = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      messagesContainer.scrollTop = scrollHeight;
    }
  };

  shouldDisableSubmit() {
    const textOrig = this.props.form.getFieldValue('message');
    if (!textOrig) return false;
    const text = textOrig.trim();
    const { files } = this.props;
    return !(files && files.length) && !(text && text.length);
  }

  handleSubmit(e) {
    const { team } = this.props;
    if (this.shouldDisableSubmit() || !team.active) {
      return;
    }

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { conversationId } = this.props.conversations;
        const postBody = { content: [] };
        const message = values.message ? values.message.trim() : '';

        this.stopTyping();
        this.clearTypingTimer();

        if (this.props.files && this.props.files.length > 0) {
          const resources = this.props.files.map(file => this.createResource(file));
          Promise.all(resources)
            .then(res => {
              this.props.form.resetFields();
              postBody.content = res.map((createdResource, index) => ({
                type: this.props.files[index].type,
                resourceId: createdResource.data.resourceId,
                meta: {
                  fileName: this.props.files[index].name,
                  fileSize: this.props.files[index].size,
                  lastModified: this.props.files[index].lastModifiedDate
                }
              }));
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
            })
            .catch(error => {
              this.props.updateFileList(this.props.files);
              this.setState({ file: null });
              msg.error(error.message);
            });
        } else if (message) {
          postBody.content.push({ type: 'text/plain', text: message });
          if (this.state.replyTo) {
            const { messageId } = this.state.replyTo;
            postBody.replyTo = messageId;
            this.setState({ replyTo: null, showPreviewBox: false });
          }
          this.props
            .createMessage(postBody, conversationId)
            .then(({ data }) => {
              this.setState({ lastSubmittedMessage: data.message });
              this.props.form.resetFields();
            })
            .catch(error => {
              msg.error(error.message);
            });
        }
      }
    });
  }

  createResource(file) {
    const fileSource = file.src.split('base64,')[1] || file.src;
    const { team, orgId } = this.props;
    if (!team.teamId || !orgId) {
      // Todo throw error invalid team or subscriberOrg
      throw new Error();
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length,
        'x-hablaai-teamid': team.teamId,
        'x-hablaai-subscriberorgid': orgId
      },
      onUploadProgress: progressEvent => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${this.props.resourcesUrl}/${file.name}`, fileSource, requestConfig);
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  }

  renderMessages(isAdmin) {
    const { conversations, user, team, orgId } = this.props;
    const { members, lastSubmittedMessage } = this.state;
    if (!members) return null;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;

    return conversations.transcript.map(message => {
      if (message.deleted) return null;
      const createdBy = members.find(member => member.userId === message.createdBy);
      return (
        <Message
          conversationDisabled={!team.active}
          message={message}
          user={createdBy}
          currentUser={user}
          key={message.messageId}
          onMessageAction={this.onMessageAction}
          hide={false}
          currentPath={currentPath}
          teamMembers={members}
          onFileChange={this.onFileChange}
          subscriberOrgId={orgId}
          teamId={team.teamId}
          isAdmin={isAdmin}
          onLoadImages={this.scrollToBottom}
        />
      );
    });
  }

  renderTeamMembers() {
    const { user } = this.props;
    const { members } = this.state;

    // Order Members, current user always first
    const otherMembers = _.reject(members, { userId: user.userId });
    const orderedMembers = otherMembers.sort(sortByFirstName);

    return [user, ...orderedMembers].map(member => (
      <Tooltip key={member.userId} placement="top" title={member.fullName}>
        <div className="mr-05">
          <AvatarWrapper size="small" user={member} />
        </div>
      </Tooltip>
    ));
  }

  renderMembersTyping() {
    const { membersTyping } = this.props;
    const { members } = this.state;
    if (!membersTyping) return null;

    const findUser = userId => _.find(members, { userId });
    const membersTypingData = _.compact(_.map(membersTyping, (typing, userId) => typing && findUser(userId)));
    if (membersTypingData.length === 0) return null;

    const lastIndex = membersTypingData.length - 1;
    const getSuffix = index => {
      if (index === lastIndex) return ' ';
      if (index === lastIndex - 1) return String.t('typingActivityMultipleMemberLastSeparator');
      return String.t('typingActivityMultipleMemberSeparator');
    };

    return (
      <div>
        {membersTypingData.map((member, index) => (
          <span key={member.userId}>
            <span className="team-room__members-typing-name">{member.fullName}</span>
            {getSuffix(index)}
          </span>
        ))}
        {String.t('typingActivityTyping', { count: members.length })}
      </div>
    );
  }

  render() {
    const {
      team,
      teamMembers,
      unreadMessagesCount,
      user,
      conversations,
      showPageHeader,
      showTeamMembers,
      menuOptions
    } = this.props;
    const { teamMembersLoaded, conversationsLoaded } = this.state;

    if (teamMembersLoaded && conversationsLoaded && user && teamMembers) {
      const isAdmin = false;
      const { conversationId } = conversations;
      const lastMessage = _.last(conversations.transcript) || {};
      const className = classNames({
        'ChatPage-main': true,
        'team-room-chat': true,
        'team-room__main-container--opacity': this.state.isDraggingOver
      });

      return (
        <div className={className}>
          {showPageHeader && (
            <PageHeader
              pageBreadCrumb={{
                routes: [
                  {
                    title: team.name,
                    link: `/app/team/${team.teamId}`
                  },
                  { title: String.t('chat.title') }
                ]
              }}
              badgeOptions={{
                enabled: true,
                count: conversations.transcript.length,
                style: { backgroundColor: '#32a953' }
              }}
              hasMenu
              menuName="settings"
              menuPageHeader={menuOptions}
            />
          )}
          {showTeamMembers && (
            <SimpleCardContainer className="Chat_Header">
              <div className="Chat_members_container">
                <span className="Chat_members_number mr-05">{teamMembers.length}</span>
                {this.renderTeamMembers()}
              </div>
              <div className="Chat_expandAction" onClick={() => this.props.showChat(true)}>
                <i className="fas fa-angle-double-down" />
              </div>
            </SimpleCardContainer>
          )}

          {unreadMessagesCount > 0 && (
            <SimpleCardContainer className="team-room__unread-messages padding-class-a">
              <div
                className="team-room__unread-messages-link"
                onClick={() => this.props.readMessage(lastMessage.messageId, conversationId)}
              >
                {String.t('teamRoomPage.markAllAsRead')}
              </div>
              <div className="team-room__unread-messages-dot">&middot;</div>
              <div className="team-room__unread-messages-count">
                {String.t('teamRoomPage.unreadMessagesCount', { count: unreadMessagesCount })}
              </div>
            </SimpleCardContainer>
          )}

          <SimpleCardContainer className="team__messages">{this.renderMessages(isAdmin)}</SimpleCardContainer>

          <SimpleCardContainer className="Chat_container">
            {this.state.showPreviewBox && (
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
            )}
            <div className="Chat__message_input">
              <div className="team-room__chat-input__image-wrapper">
                <AvatarWrapper size="large" user={user} />
              </div>
              <div className="team-room__chat-input-wrapper">
                <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off" disabled={!team.active}>
                  <TextField
                    disabled={!team.active}
                    componentKey="message"
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder={String.t('teamRoomPage.replyPlaceholder')}
                    label=""
                    className="team-room__chat-input-form-item"
                    inputClassName="team-room__chat-input-textfield"
                    onChange={this.handleTyping}
                    autoFocus
                  />
                </Form>
              </div>
              <div className="team-room__chat-col-icons">
                <a
                  className="team-room__icons"
                  role="button"
                  tabIndex={0}
                  disabled={this.shouldDisableSubmit() || !team.active}
                  onClick={this.handleSubmit}
                >
                  <i className="fas fa-paper-plane" />
                </a>
                <div>
                  <input
                    id="fileupload"
                    disabled={!team.active}
                    className="team-room__file-upload-input"
                    type="file"
                    onChange={this.onFileChange}
                    multiple
                  />
                  <label htmlFor="fileupload" className="team-room__icons">
                    <Tooltip placement="top" title={String.t('teamRoomPage.tooltipAttachments')} arrowPointAtCenter>
                      <i className="fas fa-paperclip" />
                    </Tooltip>
                  </label>
                </div>
              </div>
            </div>
            <div className="team-room__members-typing">{this.renderMembersTyping()}</div>
          </SimpleCardContainer>
        </div>
      );
    }

    return <Spinner />;
  }
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default Form.create()(Chat);
