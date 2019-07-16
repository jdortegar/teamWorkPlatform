import React from 'react';
import * as ReactDOM from 'react-dom';
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
  fetchMessage: PropTypes.func.isRequired,
  lastMessage: PropTypes.object
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
  lastMessage: null
};

// When is near to bottom
const BOTTOM_SCROLL_LIMIT = 200;

// File type for drag and drop function
export const ItemTypes = {
  FILE: 'file'
};

class Chat extends React.Component {
  // if is neccesary scroll to bottom
  static scrollAtBottom = true;

  constructor(props) {
    super();

    this.state = {
      members: [],
      replyTo: null,
      lastSubmittedMessage: null,
      membersFiltered: [],
      userIsEditing: false,
      loadingOldMessages: false,
      loadingConversation: true,
      chatHistory: [],
      bottomScrollSensor: false,
      scrollToMessage: props.scrollToMessageId,
      nextPagination: null,
      prevPagination: null
    };
  }

  componentDidMount() {
    const { conversation, users, usersPresences, scrollToMessageId } = this.props;

    // if conversation doesn't exist in the app state
    if (!conversation) {
      this.props.fetchConversations();
      return;
    }

    if (this.state.scrollToMessage) {
      this.props.fetchMessage(conversation.id, scrollToMessageId).then(pagination => {
        this.setState({ loadingConversation: false, nextPagination: pagination, prevPagination: pagination });
        this.scrollToUnread();
      });
    } else {
      // Fetch conversation and save in local state
      this.props.fetchMessages(conversation.id).then(pagination => {
        this.setState({
          loadingConversation: false,
          nextPagination: pagination,
          prevPagination: pagination
        });
        this.scrollToUnread();
      });
    }
    this.updateMembers({ conversation, users, usersPresences });
    this.props.fetchBookmarks();
    this.setState({ chatHistory: conversation.messages });

    // Add scroll event
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;
    messagesContainer.addEventListener('scroll', this.onScroll, false);
  }

  componentWillReceiveProps(nextProps) {
    const { conversation, users, usersPresences } = nextProps;

    // conversation doesn't exist in the app state
    if (!conversation) {
      this.props.fetchConversations();
      return;
    }

    // If pagination change
    if (
      conversation.id === this.props.conversation.id &&
      !_.isEqual(conversation.messages, this.props.conversation.messages)
    ) {
      // Add messages to state if scroll
      const chatHistoryArray = [...this.state.chatHistory, ...conversation.messages];
      this.setState({
        chatHistory: _.sortBy(this.removeDuplicates(chatHistoryArray, 'id'), 'created')
      });

      // If is near bottom scroll
      if (this.isNearBottom() || !this.lastMessageEqual) {
        this.scrollToUnread();
      }
    }

    this.lastMessageEqual = _.isEqual(nextProps.lastMessage, this.props.lastMessage);

    if (!this.lastMessageEqual) {
      this.setState({ loadingOldMessages: true });
      this.props.fetchMessages(conversation.id).then(pagination => {
        this.setState({ loadingOldMessages: false, nextPagination: pagination });
        this.scrollToUnread();
      });
    }

    // it's a new conversation or navigating between conversations
    if ((!this.props.conversation && conversation) || this.props.conversation.id !== conversation.id) {
      this.setState({ loadingConversation: true });
      this.updateMembers({ conversation, users, usersPresences });

      // Fetch new conversation messages and scroll
      this.props.fetchMessages(conversation.id).then(() => {
        this.setState({ loadingConversation: false });
        this.scrollToUnread();
      });
      this.props.fetchBookmarks();

      this.setState({ chatHistory: conversation.messages });
      this.topMessage = false;

      // Add scroll event
      const [messagesContainer] = document.getElementsByClassName('team__messages');
      if (!messagesContainer) return;
      messagesContainer.addEventListener('scroll', this.onScroll, false);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Chat history change and last message change
    this.historyChanged = nextState.chatHistory.length !== this.state.chatHistory.length;

    // Set container container
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return true;

    // If scroll are in the bottom
    const scrollPos = messagesContainer.scrollTop;
    if (this.historyChanged) {
      const scrollBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight;
      this.scrollAtBottom = scrollBottom <= 0 || scrollPos === scrollBottom;
    }

    // If not are in the bottom save scroll position
    if (!this.scrollAtBottom && scrollPos === 0) {
      const numMessages = messagesContainer.childNodes[1].childNodes.length;
      this.topMessage = numMessages === 0 ? null : messagesContainer.childNodes[1].childNodes[0];
    }

    // Update if chatHistory, pagination or conversation changed
    return (
      !_.isEqual(nextState.chatHistory, this.state.chatHistory) ||
      nextState.loadingOldMessages !== this.state.loadingOldMessages ||
      nextState.loadingConversation !== this.state.loadingConversation ||
      nextState.membersFiltered !== this.state.membersFiltered ||
      this.props.team !== nextProps.team ||
      this.props.membersTyping !== nextProps.membersTyping
    );
  }

  componentDidUpdate(prevProps) {
    // If chat history changed
    if (this.historyChanged) {
      const ownMessage = this.props.lastMessage && this.props.lastMessage.createdBy === this.props.currentUser.userId;
      // If last message is not equal and it's own message scroll

      if (!this.lastMessageEqual && ownMessage) {
        this.scrollToUnread();
      }
      // if top position is saved and the last message is equal, pagination happen
      if (this.topMessage && this.lastMessageEqual) {
        // eslint-disable-next-line react/no-find-dom-node
        ReactDOM.findDOMNode(this.topMessage).scrollIntoView();
        this.topMessage = false;
      }
    }

    const { conversation, readMessages } = this.props;
    // if exist conversation return
    if (!prevProps.conversation || !conversation) return;
    // If messages lenght are equal return
    if (prevProps.conversation.messages.length === conversation.messages.length) return;
    // If conversation id is equal
    if (prevProps.conversation.id === conversation.id) return;

    // If is near button, send fire readMessages function
    if (this.isNearBottom()) {
      // debounce readMessages to prevent sending too many requests
      const readMessagesDebounced = _.debounce(readMessages, 500);
      readMessagesDebounced(conversation.id);
    }
  }

  componentWillUnmount() {
    this.setState({ chatHistory: [] });
    // When Unmount component remove scroll even
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;
    return messagesContainer.removeEventListener('scroll', this.onScroll);
  }

  // Custom Functions

  removeDuplicates = (myArr, prop) => {
    // Remove duplicate elements from conversation array
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  };

  onScroll = () => {
    // scroll event
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;

    const { scrollTop } = messagesContainer;
    const { conversation } = this.props;
    const { nextPagination, prevPagination, bottomScrollSensor, loadingOldMessages, loadingConversation } = this.state;
    // if next page exist and scroll touch Top
    if (
      scrollTop < 200 &&
      nextPagination.nextPage !== null &&
      bottomScrollSensor &&
      !loadingOldMessages &&
      !loadingConversation
    ) {
      this.setState({ loadingOldMessages: true });
      // call API to get older Messages
      this.props.fetchMessages(conversation.id, nextPagination.nextPage).then(pagination => {
        this.setState({ loadingOldMessages: false, nextPagination: pagination });
      });
    }

    // if prev page exist and scroll touch bottom
    if (
      this.isNearBottom() &&
      prevPagination.prevPage !== null &&
      bottomScrollSensor &&
      !loadingOldMessages &&
      !loadingConversation
    ) {
      this.setState({ loadingOldMessages: true });
      // call API to get older Messages
      this.props.fetchMessages(conversation.id, prevPagination.prevPage).then(pagination => {
        this.setState({ loadingOldMessages: false, prevPagination: pagination });
      });
    }

    return false;
  };

  updateMembers = ({ conversation, users, usersPresences }) => {
    // Update member presences
    const members = conversation.members.map(memberId => ({
      ...users[memberId],
      online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    }));
    this.setState({ members, membersFiltered: members });
  };

  onMessageAction = (payload, action) => {
    // If user replies or delete message
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
    // If scroll is near bottom
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
  };

  scrollToUnread = () => {
    // scroll to unread if exist or scroll bottom
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer && !this.state.loadingConversation) return;
    let [unreadMark] = messagesContainer.getElementsByClassName('message__unread_mark') || null;
    // If scrollToMessageId exists set as unread mark

    if (this.state.scrollToMessage) {
      [unreadMark] = messagesContainer.getElementsByClassName(this.state.scrollToMessage);
    }

    const { clientHeight, scrollHeight } = messagesContainer;
    const maxScrollTop = scrollHeight - clientHeight;
    // Scroll to unreadMark or scroll to bottom
    if (unreadMark) {
      messagesContainer.scrollTop = unreadMark.offsetTop - 50;
      this.setState({ scrollToMessage: false });
    } else {
      messagesContainer.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
    // Scroll is not at top
    this.setState({ bottomScrollSensor: true });
  };

  setScrollEvent = () => {
    // Set scroll event
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;
    messagesContainer.addEventListener('scroll', this.handleScroll);
  };

  handleScroll = () => {
    const [messagesContainer] = document.getElementsByClassName('team__messages');
    if (!messagesContainer) return;

    const { conversation, readMessages } = this.props;
    // If user scroll to bottom and read unread Mesages, fie readMessages function
    if (messagesContainer.scrollHeight === messagesContainer.scrollTop + messagesContainer.clientHeight) {
      messagesContainer.removeEventListener('scroll', this.handleScroll);
      readMessages(conversation.id);
    }
  };

  handleStateOnParent = obj => {
    // Cange state from child
    this.setState(obj);
  };

  handleOwnerFilterClick = userId => {
    // Filter messages per user
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
    const { membersFiltered, lastSubmittedMessage, userIsEditing, chatHistory } = this.state;

    if (!membersFiltered) return null;
    let unreadExists = false;
    let previousSenderId = null;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;

    return chatHistory.map(message => {
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
            onLoadMessage={this.scrollToUnread}
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
    const { members, membersFiltered, loadingOldMessages, loadingConversation } = this.state;

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
          <div style={{ padding: '10px' }}>
            <Skeleton loading={loadingOldMessages} active avatar />
          </div>
          {loadingConversation ? <Spinner /> : <SimpleCardContainer>{this.renderMessages()}</SimpleCardContainer>}
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
