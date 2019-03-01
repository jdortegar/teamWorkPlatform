import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EmojiPicker from 'emoji-picker-react';

import classNames from 'classnames';
import { formShape } from 'src/propTypes';
import { Form, Tooltip, message as msg, Input } from 'antd';
import { PageHeader, SimpleCardContainer, Spinner, AvatarWrapper, PreviewBar, Message } from 'src/components';
import { TeamCallButton } from 'src/containers';
import { messageAction } from 'src/components/Message/Message';
import { sortByFirstName } from 'src/redux-hablaai/selectors/helpers';
import String from 'src/translations';
import axios from 'axios';
import './styles/style.css';
import JSEMOJI from 'emoji-js';
import FilterUserMessages from './FilterUserMessages';

// emoji set up
const jsemoji = new JSEMOJI();
// set the style to emojione (default - apple)
jsemoji.img_set = 'emojione';
// set the storage location for all emojis
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';

const propTypes = {
  team: PropTypes.object,
  teamMembers: PropTypes.array,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  fetchTeamMembers: PropTypes.func.isRequired,
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
  menuOptions: PropTypes.array,
  personalConversation: PropTypes.object,
  fetchMetadata: PropTypes.func.isRequired,
  lastReadTimestamp: PropTypes.string
};

const defaultProps = {
  conversations: {},
  files: [],
  membersTyping: null,
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null,
  menuOptions: [],
  personalConversation: {},
  team: {},
  teamMembers: [],
  lastReadTimestamp: null
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
      file: null,
      membersFiltered: [],
      showEmojiPicker: false,
      visited: false
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onMessageAction = this.onMessageAction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.typingTimer = null;
  }

  componentDidMount() {
    const { team, personalConversation } = this.props;

    // If is team conversation
    if (!_.isEmpty(team)) {
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

        this.setState({ teamMembersLoaded: true, members, membersFiltered: members });
      });

      this.props.fetchConversations(team.teamId).then(response => {
        if (!_.isEmpty(response.data.conversations)) {
          const { conversationId } = response.data.conversations[0];

          this.props
            .fetchTranscript(conversationId)
            .then(() =>
              this.setState({
                conversationsLoaded: true
              })
            )
            .then(() => {
              this.scrollToBottom();
              this.setScrollEvent();
            });
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      });
    }

    // If is personal conversation
    if (!_.isEmpty(personalConversation)) {
      // Get members data form Users
      const { users, usersPresences } = this.props;
      const members = personalConversation.members.map(memberId => {
        const member = users[memberId];
        return {
          ...member,
          online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
        };
      });

      this.setState({ teamMembersLoaded: true, members, membersFiltered: members });

      const { conversationId } = personalConversation;

      this.props
        .fetchTranscript(conversationId)
        .then(() =>
          this.setState({
            conversationsLoaded: true
          })
        )
        .then(() => {
          this.scrollToBottom();
          this.setScrollEvent();
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextTeamId = nextProps.team.teamId;

    if (nextTeamId) {
      if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
        this.setState({ showPreviewBox: true });
      }

      const updateTeamMembers = () => {
        const { teamMembers, users, usersPresences } = nextProps;
        const members = teamMembers.map(memberId => {
          const member = users[memberId];
          return {
            ...member,
            online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
          };
        });

        this.setState({
          teamMembersLoaded: true,
          members,
          membersFiltered: members
        });
      };

      if (
        !_.isEqual(nextProps.teamMembers, this.props.teamMembers) ||
        !_.isEqual(nextProps.users, this.props.users) ||
        !_.isEqual(nextProps.teamMembers, _.map(this.state.members, 'userId'))
      ) {
        updateTeamMembers();
      }

      if (this.props.team.teamId !== nextTeamId) {
        this.setState({ teamMembersLoaded: false, conversationsLoaded: false });
        this.props.fetchTeamMembers(nextTeamId).then(updateTeamMembers);

        this.props.fetchConversations(nextTeamId).then(response => {
          if (!_.isEmpty(response.data.conversations)) {
            const { conversationId } = response.data.conversations[0];
            this.props
              .fetchTranscript(conversationId)
              .then(() => this.setState({ conversationsLoaded: true }))
              .then(this.scrollToBottom);
          }
          if (response.data === 'STALE') {
            this.setState({ conversationsLoaded: true });
          }
        });
      }
    }

    const nextPersonalConversation = nextProps.personalConversation;

    if (!_.isEmpty(nextPersonalConversation) && this.props.personalConversation) {
      if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
        this.setState({ showPreviewBox: true });
      }

      // Get members data form Users
      if (!_.isEqual(nextProps.users, this.props.users)) {
        const { users, usersPresences } = nextProps;

        const members = nextPersonalConversation.members.map(memberId => {
          const member = users[memberId];
          return {
            ...member,
            online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
          };
        });

        this.setState({ teamMembersLoaded: true, members, membersFiltered: members });
      }

      if (nextPersonalConversation.conversationId !== this.props.personalConversation.conversationId) {
        const { conversationId } = nextPersonalConversation;

        this.props
          .fetchTranscript(conversationId)
          .then(() =>
            this.setState({
              conversationsLoaded: true
            })
          )
          .then(this.scrollToBottom);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { teamMembersLoaded, conversationsLoaded } = this.state;

    if (!teamMembersLoaded || !conversationsLoaded) {
      return;
    }

    const { conversations, user } = this.props;
    if (!prevProps.conversations || !conversations) return;
    if (prevProps.conversations.transcript.length === conversations.transcript.length) return;

    const lastMessage = _.last(conversations.transcript) || {};
    const ownMessage = lastMessage.createdBy === user.userId;
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

  // Hande emoticons when are clicked
  handleEmojiClick = (n, e) => {
    const emoji = jsemoji.replace_colons(`:${e.name}:`);
    const { message } = this.props.form.getFieldsValue();
    this.props.form.setFieldsValue({ message: `${message || ''} ${emoji}` });
    this.setState({ showEmojiPicker: false });
  };

  toogleEmojiState = () => {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
  };

  setScrollEvent = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return false;
    return messagesContainer.addEventListener('scroll', this.handleScroll);
  };

  isNearBottom = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
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

    const unreadMark = messagesContainer.getElementsByClassName('message__unread_mark')[0] || null;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      if (unreadMark) {
        messagesContainer.scrollTop = unreadMark.offsetTop - 50;
      } else {
        messagesContainer.scrollTop = scrollHeight;
      }
    }
  };

  handleScroll = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return;

    const { conversations } = this.props;
    const { conversationId } = conversations;
    const lastMessage = _.last(conversations.transcript) || {};
    if (messagesContainer.scrollHeight === messagesContainer.scrollTop + messagesContainer.clientHeight) {
      this.props.readMessage(lastMessage.messageId, conversationId);
      messagesContainer.removeEventListener('scroll', this.handleScroll);
      this.setState({
        visited: true
      });
    }
  };

  handleOwnerFilterClick = userId => {
    const { users } = this.props;
    const userFiltered = Object.values(users).find(user => user.userId === userId);
    let { membersFiltered } = this.state;
    membersFiltered = _.xorBy(membersFiltered, [userFiltered], 'userId');
    this.setState({
      membersFiltered
    });
  };

  createResource(file) {
    const fileSource = file.src.split('base64,')[1] || file.src;
    const { team, orgId, personalConversation } = this.props;

    if (!orgId) {
      // Todo throw error invalid team or subscriberOrg
      throw new Error();
    }
    let keyImageId = team.teamId;
    if (!Object.values(team).length > 0) {
      keyImageId = personalConversation.conversationId;
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length,
        'x-hablaai-teamid': keyImageId,
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

  handleSubmit(e) {
    if (this.shouldDisableSubmit()) {
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

  shouldDisableSubmit() {
    const textOrig = this.props.form.getFieldValue('message');
    if (!textOrig) return false;
    const text = textOrig.trim();
    const { files } = this.props;
    return !(files && files.length) && !(text && text.length);
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  }

  messagesCounter() {
    const { conversations } = this.props;
    const { membersFiltered } = this.state;
    if (!membersFiltered) return 0;
    const messages = conversations.transcript.map(message => {
      if (message.deleted) return null;
      const createdBy = membersFiltered.find(member => member.userId === message.createdBy);
      if (!createdBy) return null;
      return message;
    });
    return messages.filter(mes => mes).length;
  }

  renderMessages(isAdmin) {
    const { conversations, user, team, orgId, personalConversation, lastReadTimestamp } = this.props;
    const { membersFiltered, lastSubmittedMessage, visited } = this.state;
    if (!membersFiltered) return null;
    let lastReadExists = false;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;
    return conversations.transcript.map(message => {
      // If message was creted after last read message timestamp
      const lastRead = lastReadExists ? null : lastReadTimestamp < message.created;
      if (lastRead || visited) {
        lastReadExists = true;
      }
      if (message.deleted) return null;
      // found creator
      const createdBy = membersFiltered.find(member => member.userId === message.createdBy);
      if (!createdBy) return null;
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
          teamMembers={membersFiltered}
          onFileChange={this.onFileChange}
          subscriberOrgId={orgId}
          teamId={team.teamId}
          isAdmin={isAdmin}
          onLoadImages={this.scrollToBottom}
          personalConversation={personalConversation}
          fetchMetadata={this.props.fetchMetadata}
          lastRead={lastRead}
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

    return (
      <FilterUserMessages
        owners={[user, ...orderedMembers]}
        onOwnerFilterClick={this.handleOwnerFilterClick}
        excludeOwnersFilter={this.state.membersFiltered}
        className="CKGPage__FilesFilters"
      />
    );
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
        {String.t('typingActivityTyping', { count: membersTypingData.length })}
      </div>
    );
  }

  render() {
    const { team, teamMembers, user, conversations, showPageHeader, showTeamMembers, menuOptions } = this.props;
    const { teamMembersLoaded, conversationsLoaded } = this.state;

    const { getFieldDecorator } = this.props.form;

    if (!teamMembersLoaded || !conversationsLoaded || !user || !teamMembers || !conversations) {
      return <Spinner />;
    }

    const isAdmin = false;
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
              count: this.messagesCounter(),
              style: { backgroundColor: '#32a953' }
            }}
            hasMenu
            menuName="settings"
            menuPageHeader={menuOptions}
          />
        )}
        {showTeamMembers && (
          <SimpleCardContainer className="Chat_Header">
            <div className="Chat_members_container">{this.renderTeamMembers()}</div>
            <div className="Chat_Header_right_buttons">
              <div className="Chat_videoCall_container">
                <TeamCallButton />
              </div>
              <div className="Chat_expandAction" onClick={() => this.props.showChat(true)}>
                <i className="fas fa-angle-down" />
              </div>
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
              <AvatarWrapper size="default" user={user} />
            </div>
            <div className="team-room__chat-input-wrapper">
              <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
                {/* <TextField
                  componentKey="message"
                  form={this.props.form}
                  hasFeedback={false}
                  placeholder={String.t('chat.replyPlaceholder')}
                  label=""
                  className="team-room__chat-input-form-item"
                  inputClassName="team-room__chat-input-textfield"
                  onBlur={this.handleTyping}
                  autoFocus
                /> */}

                <Form.Item className="team-room__chat-input-form-item" hasFeedback={false}>
                  {getFieldDecorator('message', {})(
                    <Input
                      placeholder={String.t('chat.replyPlaceholder')}
                      className="team-room__chat-input-textfield"
                      onFocus={this.handleTyping}
                    />
                  )}
                </Form.Item>
              </Form>
            </div>
            <div className="team-room__chat-col-icons">
              <a
                className="team-room__icons"
                role="button"
                tabIndex={0}
                disabled={this.shouldDisableSubmit()}
                onClick={() => this.toogleEmojiState()}
              >
                <i className="far fa-smile" />
              </a>
              <div className="emoji-table">
                {this.state.showEmojiPicker && <EmojiPicker onEmojiClick={this.handleEmojiClick} />}
              </div>
              <div>
                <input
                  id="fileupload"
                  className="team-room__file-upload-input"
                  type="file"
                  onChange={this.onFileChange}
                  multiple
                />
                <label htmlFor="fileupload" className="team-room__icons">
                  <Tooltip placement="top" title={String.t('chat.tooltipAttachments')} arrowPointAtCenter>
                    <i className="fas fa-paperclip" />
                  </Tooltip>
                </label>
              </div>
              <a
                className="team-room__icons"
                role="button"
                tabIndex={0}
                disabled={this.shouldDisableSubmit()}
                onClick={this.handleSubmit}
              >
                <i className="fas fa-paper-plane" />
              </a>
            </div>
          </div>
          <div className="team-room__members-typing">{this.renderMembersTyping()}</div>
        </SimpleCardContainer>
      </div>
    );
  }
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default Form.create()(Chat);
