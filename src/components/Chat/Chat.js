import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import classNames from 'classnames';
import { message as msg } from 'antd';
import { SimpleCardContainer, Spinner, Message } from 'src/components';
import { messageAction } from 'src/components/Message/Message';
import String from 'src/translations';
import './styles/style.css';
import JSEMOJI from 'emoji-js';
import TopBar from './TopBar';
import MessageInput from './MessageInput';

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

const BOTTOM_SCROLL_LIMIT = 200;

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: null,
      teamMembersLoaded: false,
      conversationsLoaded: false,
      replyTo: null,
      lastSubmittedMessage: null,
      membersFiltered: []
    };

    this.onMessageAction = this.onMessageAction.bind(this);
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
              .then(() => {
                this.scrollToBottom();
                this.setScrollEvent();
              });
          }
          if (response.data === 'STALE') {
            this.setState({ conversationsLoaded: true });
          }
        });
      }
    }

    const nextPersonalConversation = nextProps.personalConversation;

    if (!_.isEmpty(nextPersonalConversation) && this.props.personalConversation) {
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
          .then(() => {
            this.scrollToBottom();
            this.setScrollEvent();
          });
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

  onMessageAction(payload, action) {
    const { message, bookmark, extraInfo } = payload;
    const { user, orgId } = this.props;

    switch (action) {
      case messageAction.replyTo:
        this.setState({ replyTo: extraInfo });
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

  handlelastSubmittedMessage = data => {
    this.setState({
      lastSubmittedMessage: data
    });
  };

  resetReplyTo = () => {
    this.setState({
      replyTo: false
    });
  };

  renderMessages(isAdmin) {
    const { conversations, user, team, orgId, personalConversation, lastReadTimestamp } = this.props;
    const { membersFiltered, lastSubmittedMessage } = this.state;
    if (!membersFiltered) return null;
    let lastReadExists = false;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;
    return conversations.transcript.map(message => {
      // If message was creted after last read message timestamp
      let lastRead = null;
      if (message.createdBy !== user.userId) {
        lastRead = lastReadExists ? null : lastReadTimestamp < message.created;
        if (lastRead) {
          lastReadExists = true;
          this.setScrollEvent();
        }
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
          clearFileList={this.props.clearFileList}
        />
      );
    });
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
    const { teamMembersLoaded, conversationsLoaded, members, membersFiltered } = this.state;

    if (!teamMembersLoaded || !conversationsLoaded || !user || !teamMembers || !conversations) {
      return <Spinner />;
    }

    const isAdmin = false;
    const className = classNames({
      'ChatPage-main': true,
      'team-room-chat': true,
      'team-room__main-container--opacity': this.state.isDraggingOver
    });

    console.log('render', conversations.conversationId);

    return (
      <div className={className}>
        {team && (
          <TopBar
            showPageHeader={showPageHeader}
            showTeamMembers={showTeamMembers}
            team={team}
            showchat={this.props.showChat}
            conversations={conversations}
            menuOptions={menuOptions}
            user={user}
            onOwnerFilterClick={this.handleOwnerFilterClick}
            members={members}
            membersFiltered={membersFiltered}
          />
        )}
        <SimpleCardContainer className="team__messages">{this.renderMessages(isAdmin)}</SimpleCardContainer>

        <SimpleCardContainer className="Chat_container">
          <MessageInput
            user={user}
            conversations={conversations}
            iAmTyping={this.props.iAmTyping}
            handleSubmit={this.handleSubmit}
            shouldDisableSubmit={this.shouldDisableSubmit}
            onFileChange={this.onFileChange}
            createMessage={this.props.createMessage}
            removeFileFromList={this.props.removeFileFromList}
            addBase={this.props.addBase}
            updateFileList={this.props.updateFileList}
            isDraggingOver={this.props.isDraggingOver}
            token={this.props.token}
            resourcesUrl={this.props.resourcesUrl}
            orgId={this.props.orgId}
            files={this.props.files}
            clearFileList={this.props.clearFileList}
            handlelastSubmittedMessage={this.handlelastSubmittedMessage}
            replyTo={this.state.replyTo}
            resetReplyTo={this.resetReplyTo}
          />
          <div className="team-room__members-typing">{this.renderMembersTyping()}</div>
        </SimpleCardContainer>
      </div>
    );
  }
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default Chat;
