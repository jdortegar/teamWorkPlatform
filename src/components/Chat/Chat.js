import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DropTarget } from 'react-dnd';

import classNames from 'classnames';
import { message as msg } from 'antd';
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
  connectDropTarget: PropTypes.func.isRequired
};

const defaultProps = {
  conversation: {},
  files: [],
  membersTyping: null,
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null,
  menuOptions: [],
  team: {}
};

const BOTTOM_SCROLL_LIMIT = 200;

export const ItemTypes = {
  FILE: 'file'
};

class Chat extends React.Component {
  state = {
    members: [],
    replyTo: null,
    lastSubmittedMessage: null,
    membersFiltered: [],
    userIsEditing: false
  };

  componentDidMount() {
    const { conversation, users, usersPresences } = this.props;

    // conversation doesn't exist in the app state
    if (!conversation) {
      this.props.fetchConversations();
      return;
    }

    this.updateMembers({ conversation, users, usersPresences });

    this.props.fetchMessages(conversation.id);
    this.props.fetchBookmarks();
  }

  componentWillReceiveProps(nextProps) {
    const { conversation, users, usersPresences } = nextProps;

    // conversation doesn't exist in the app state
    if (!conversation) {
      this.props.fetchConversations();
      return;
    }

    // it's a new conversation or navigating between conversations
    if ((!this.props.conversation && conversation) || this.props.conversation.id !== conversation.id) {
      this.updateMembers({ conversation, users, usersPresences });

      this.props.fetchMessages(conversation.id);
      this.props.fetchBookmarks();
    }
  }

  componentDidUpdate(prevProps) {
    const { conversation, currentUser } = this.props;
    if (!prevProps.conversation || !conversation) return;
    if (prevProps.conversation.messages.length === conversation.messages.length) return;

    const lastMessage = _.last(conversation.messages) || {};
    const ownMessage = lastMessage.createdBy === currentUser.userId;
    if (ownMessage || this.isNearBottom()) this.scrollToBottom();
  }

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

  isNearBottom = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
  };

  scrollToBottom = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;

    const [unreadMark] = messagesContainer.getElementsByClassName('message__unread_mark') || null;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      if (unreadMark) {
        messagesContainer.scrollTop = unreadMark.offsetTop - 50;
      } else {
        messagesContainer.scrollTop = scrollHeight;
      }
    }

    // debounce readMessages to prevent sending too many requests
    const { conversation, readMessages } = this.props;
    const readMessagesDebounced = _.debounce(readMessages, 1000);
    readMessagesDebounced(conversation.id);
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
      readMessages(conversation.id);
      messagesContainer.removeEventListener('scroll', this.handleScroll);
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
        <ChatMessage
          key={message.id}
          message={message}
          teamId={team.teamId}
          conversationId={conversation.id}
          currentPath={currentPath}
          teamMembers={membersFiltered}
          unread={unread}
          grouped={grouped}
          scrollToBottom={this.scrollToBottom}
          onMessageAction={this.onMessageAction}
          sharedData={message.sharedData}
          showMetadata
          handleStateOnParent={this.handleStateOnParent}
          userIsEditing={userIsEditing}
        />
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
    const { members, membersFiltered } = this.state;

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
