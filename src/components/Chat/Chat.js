import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DropTarget } from 'react-dnd';

import classNames from 'classnames';
import { message as msg, Skeleton } from 'antd';
import { ChatMessage, MessageInput } from 'src/containers';
import { SimpleCardContainer, Spinner } from 'src/components';
import { messageAction } from 'src/components/ChatMessage/ChatMessage';
import String from 'src/translations';
import './styles/style.css';
import TopBar from './TopBar';

const propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        children: PropTypes.array.isRequired,
        created: PropTypes.string.isRequired,
        createdBy: PropTypes.string.isRequired,
        path: PropTypes.string,
        content: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string,
            type: PropTypes.string
          })
        ).isRequired,
        sharedData: PropTypes.object
      })
    )
  }),
  team: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
  files: PropTypes.array,
  removeFileFromList: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  clearFileList: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  fetchBookmarks: PropTypes.func.isRequired,
  fetchMessages: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  membersTyping: PropTypes.object,
  readMessages: PropTypes.func.isRequired,
  showPageHeader: PropTypes.bool,
  showTeamMembers: PropTypes.bool,
  showChat: PropTypes.func,
  menuOptions: PropTypes.array,
  connectDropTarget: PropTypes.func.isRequired,
  scrollToMessageId: PropTypes.string,
  currentPagination: PropTypes.object,
  resetPagination: PropTypes.func.isRequired,
  pushMessage: PropTypes.object
};

const defaultProps = {
  conversation: {},
  files: [],
  membersTyping: null,
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null,
  menuOptions: [],
  team: {},
  scrollToMessageId: null,
  currentPagination: {},
  pushMessage: {}
};

const BOTTOM_SCROLL_LIMIT = 200;
const TOP_SCROLL_LIMIT = 200;

export const ItemTypes = {
  FILE: 'file'
};

class Chat extends React.Component {
  state = {
    members: [],
    replyTo: null,
    lastSubmittedMessage: null,
    membersFiltered: [],
    userIsEditing: false,
    loadingOldMessages: false,
    lastMessageId: null
  };

  componentDidMount() {
    const { conversation, users, usersPresences, currentPagination } = this.props;

    // conversation doesn't exist in the app state
    if (!conversation) {
      this.props.fetchConversations();
      return;
    }

    this.updateMembers({ conversation, users, usersPresences });
    this.props.fetchMessages(conversation.id).then(() => {
      this.scrollToUnread();
    });
    this.props.fetchBookmarks();

    // Reset pagination if message count is not equal to message length
    if (conversation.messages.length !== currentPagination.itemsCount) {
      this.props.resetPagination(conversation.id);
    }

    // Add event to fetch old messages
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;
    messagesContainer.addEventListener('scroll', this.trackScrolling, false);
  }

  componentWillReceiveProps(nextProps) {
    const { conversation, users, usersPresences, currentUser, pushMessage } = nextProps;

    if (!conversation) {
      // conversation doesn't exist in the app state
      this.props.fetchConversations();
      return;
    }

    if (pushMessage) {
      const ownMessage = pushMessage.createdBy === currentUser.userId;
      this.setState({ lastMessageId: pushMessage.messageId });
      if (ownMessage) {
        this.scrolltoBottom();
      }
    }

    // it's a new conversation or navigating between conversations
    if ((!this.props.conversation && conversation) || this.props.conversation.id !== conversation.id) {
      this.updateMembers({ conversation, users, usersPresences });
      this.props.fetchMessages(conversation.id).then(this.scrollToUnread());
      this.props.fetchBookmarks();
    }
  }

  componentDidUpdate(prevProps) {
    const { conversation, readMessages } = this.props;
    if (!prevProps.conversation || !conversation) return;
    if (prevProps.conversation.messages.length === conversation.messages.length) return;

    if (this.isNearBottom()) {
      // debounce readMessages to prevent sending too many requests
      const readMessagesDebounced = _.debounce(readMessages, 500, {
        leading: true,
        trailing: false
      });
      readMessagesDebounced(conversation.id);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling, false);
  }

  trackScrolling = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;
    const { conversation, currentPagination } = this.props;
    const { loadingOldMessages } = this.state;

    if (this.isNearTop() && currentPagination.nextPage && !loadingOldMessages) {
      this.setState({ loadingOldMessages: true });
      return _.debounce(
        this.props.fetchMessages(conversation.id, Number(currentPagination.page) + 1).then(() => {
          this.setState({ loadingOldMessages: false });
        }),
        1000,
        {
          leading: true,
          trailing: false
        }
      );
    }
    return false;
  };

  updateMembers = ({ conversation, users, usersPresences }) => {
    const members = conversation.members.map(memberId => ({
      ...users[memberId],
      online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    }));
    this.setState({ members, membersFiltered: members });
  };

  onMessageAction = (payload, action) => {
    const { message, extraInfo } = payload;

    switch (action) {
      case messageAction.replyTo:
        this.setState({ replyTo: { ...message, ...extraInfo } });
        break;
      case messageAction.delete:
        this.props
          .deleteMessage(message)
          .then(() => msg.success(String.t('message.messageDeleted')))
          .catch(error => msg.error(error.message));
        break;
      default:
        break;
    }
  };

  isNearTop = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;
    const { scrollTop } = messagesContainer;
    return scrollTop < TOP_SCROLL_LIMIT;
  };

  isNearBottom = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
  };

  scrolltoBottom = (from, messageId) => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;

    const { lastMessageId } = this.state;
    if (messageId && !(messageId === lastMessageId) && !this.isNearBottom()) return;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      messagesContainer.scrollTop = scrollHeight;
    }
  };

  scrollToUnread = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;

    const { scrollToMessageId } = this.props;
    let [unreadMark] = messagesContainer.getElementsByClassName('message__unread_mark') || null;
    if (scrollToMessageId) {
      [unreadMark] = messagesContainer.getElementsByClassName(scrollToMessageId);
    }

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      if (unreadMark) {
        messagesContainer.scrollTop = unreadMark.offsetTop - 50;
      } else {
        messagesContainer.scrollTop = scrollHeight;
      }
    }
  };

  setScrollEvent = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;
    messagesContainer.addEventListener('scroll', this.handleScroll);
  };

  handleScroll = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;

    const { conversation, readMessages } = this.props;
    if (messagesContainer.scrollHeight === messagesContainer.scrollTop + messagesContainer.clientHeight) {
      messagesContainer.removeEventListener('scroll', this.handleScroll);
      readMessages(conversation.id);
    }
  };

  handleStateOnParent = obj => {
    this.setState(obj);
  };

  handleOwnerFilterClick = userId => {
    const { users } = this.props;
    const { membersFiltered } = this.state;
    const userFiltered = Object.values(users).find(user => user.userId === userId);
    this.setState({ membersFiltered: _.xorBy(membersFiltered, [userFiltered], 'userId') });
  };

  setLastSubmittedMessage = message => {
    this.setState({ lastSubmittedMessage: message });
  };

  resetReplyTo = () => {
    this.setState({ replyTo: null });
  };

  renderMessages() {
    const { conversation, currentUser, team } = this.props;
    const { membersFiltered, lastSubmittedMessage, userIsEditing } = this.state;

    if (!membersFiltered) return null;
    let unreadExists = false;
    let previousSenderId = null;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;

    return conversation.messages.map(message => {
      if (message.deleted) return null;

      // group messages from the same user
      const sender = membersFiltered.find(member => member.userId === message.createdBy);
      if (!sender) return null;
      const grouped = previousSenderId === sender.userId;
      previousSenderId = sender.userId;

      // If this is the first unread message
      const unread = !unreadExists && !message.readBy.includes(currentUser.userId);

      if (unread) {
        unreadExists = true;
        this.setScrollEvent();
      }

      return (
        <div className={message.id} key={message.id}>
          <ChatMessage
            message={message}
            teamId={team.teamId}
            conversationId={conversation.id}
            currentPath={currentPath}
            teamMembers={membersFiltered}
            unread={unread}
            grouped={grouped}
            onLoadMessage={this.scrolltoBottom}
            onMessageAction={this.onMessageAction}
            sharedData={message.sharedData}
            showMetadata
            handleStateOnParent={this.handleStateOnParent}
            userIsEditing={userIsEditing}
            scrollToSpecificMessage={this.scrollToSpecificMessage}
          />
        </div>
      );
    });
  }

  renderMembersTyping() {
    const { membersTyping, currentUser } = this.props;
    const { members } = this.state;
    if (!membersTyping) return null;

    // Remove current user from Typing array
    if (membersTyping[currentUser.userId]) {
      delete membersTyping[currentUser.userId];
    }

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
    const {
      team,
      currentUser,
      conversation,
      showPageHeader,
      showTeamMembers,
      menuOptions,
      connectDropTarget
    } = this.props;
    const { members, membersFiltered, loadingOldMessages } = this.state;

    if (!conversation) return <Spinner />;

    return (
      <div
        className={classNames({
          'ChatPage-main': true,
          'team-room-chat': true,
          'team-room__main-container--opacity': this.state.isDraggingOver
        })}
      >
        {team && (
          <TopBar
            team={team}
            user={currentUser}
            members={members}
            membersFiltered={membersFiltered}
            conversation={conversation}
            menuOptions={menuOptions}
            showPageHeader={showPageHeader}
            showTeamMembers={showTeamMembers}
            showChat={this.props.showChat}
            onOwnerFilterClick={this.handleOwnerFilterClick}
          />
        )}
        <div ref={connectDropTarget} className="team__messages">
          {loadingOldMessages && (
            <div style={{ padding: '10px' }}>
              <Skeleton loading={loadingOldMessages} active avatar />
            </div>
          )}
          <SimpleCardContainer>{this.renderMessages()}</SimpleCardContainer>
        </div>

        <SimpleCardContainer className="Chat_container">
          <MessageInput
            teamId={team.teamId}
            conversationId={conversation.id}
            removeFileFromList={this.props.removeFileFromList}
            addBase={this.props.addBase}
            clearFileList={this.props.clearFileList}
            updateFileList={this.props.updateFileList}
            setLastSubmittedMessage={this.setLastSubmittedMessage}
            resetReplyTo={this.resetReplyTo}
            isDraggingOver={this.props.isDraggingOver}
            files={this.props.files}
            replyTo={this.state.replyTo}
          />
          <div className="team-room__members-typing">{this.renderMembersTyping()}</div>
        </SimpleCardContainer>
      </div>
    );
  }
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

export default DropTarget(
  ItemTypes.FILE,
  {
    drop: props => ({ conversationId: props.conversation.id })
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(Chat);
