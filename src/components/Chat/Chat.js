import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import classNames from 'classnames';
import { message as msg } from 'antd';
import { ChatMessage, MessageInput } from 'src/containers';
import { SimpleCardContainer, Spinner } from 'src/components';
import { messageAction } from 'src/components/ChatMessage/ChatMessage';
import String from 'src/translations';
import './styles/style.css';
import TopBar from './TopBar';

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
  clearFileList: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageId: PropTypes.string.isRequired,
        children: PropTypes.array.isRequired,
        created: PropTypes.string.isRequired,
        createdBy: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
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
  fetchMessages: PropTypes.func.isRequired,
  saveBookmark: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  membersTyping: PropTypes.object,
  readMessage: PropTypes.func.isRequired,
  showPageHeader: PropTypes.bool,
  showTeamMembers: PropTypes.bool,
  showChat: PropTypes.func,
  menuOptions: PropTypes.array,
  lastReadTimestamp: PropTypes.string
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
      membersFiltered: [],
      userIsEditing: false
    };

    this.onMessageAction = this.onMessageAction.bind(this);
    this.typingTimer = null;
  }

  componentDidMount() {
    const { conversation, users, usersPresences } = this.props;

    console.warn('MOUNTING CHAT', { conversation });

    const members = conversation.members.map(memberId => ({
      ...users[memberId],
      online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    }));
    this.setState({ teamMembersLoaded: true, conversationsLoaded: true, members, membersFiltered: members });

    // If is team conversation
    // if (!_.isEmpty(team)) {
    //   this.props.fetchTeamMembers(team.teamId).then(() => {
    //     // Get members data form Users
    //     const { teamMembers, users, usersPresences } = this.props;
    //     const members = teamMembers.map(memberId => {
    //       const member = users[memberId];
    //       return {
    //         ...member,
    //         online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    //       };
    //     });

    //     this.setState({ teamMembersLoaded: true, members, membersFiltered: members });
    //   });

    //   this.props
    //     .fetchMessages(conversation.id)
    //     .then(() => this.setState({ conversationsLoaded: true }))
    //     .then(() => {
    //       this.scrollToBottom();
    //       this.setScrollEvent();
    //     });
    // }

    // // If is personal conversation
    // if (!_.isEmpty(personalConversation)) {
    //   // Get members data form Users
    //   const { users, usersPresences } = this.props;
    //   const members = personalConversation.members.map(memberId => {
    //     const member = users[memberId];
    //     return {
    //       ...member,
    //       online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    //     };
    //   });

    //   this.setState({ teamMembersLoaded: true, members, membersFiltered: members });

    //   const { conversationId } = personalConversation;

    //   this.props
    //     .fetchMessages(conversationId)
    //     .then(() => this.setState({ conversationsLoaded: true }))
    //     .then(() => {
    //       this.scrollToBottom();
    //       this.setScrollEvent();
    //     });
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { conversation } = nextProps;
    console.warn('RECEIVING PROPS CHAT', { conversation });
    // const nextTeamId = nextProps.team.teamId;

    // if (nextTeamId) {
    //   const updateTeamMembers = () => {
    //     const { teamMembers, users, usersPresences } = nextProps;
    //     const members = teamMembers.map(memberId => {
    //       const member = users[memberId];
    //       return {
    //         ...member,
    //         online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    //       };
    //     });

    //     this.setState({
    //       teamMembersLoaded: true,
    //       members,
    //       membersFiltered: members
    //     });
    //   };

    //   if (
    //     !_.isEqual(nextProps.teamMembers, this.props.teamMembers) ||
    //     !_.isEqual(nextProps.users, this.props.users) ||
    //     !_.isEqual(nextProps.teamMembers, _.map(this.state.members, 'userId'))
    //   ) {
    //     updateTeamMembers();
    //   }

    //   if (this.props.team.teamId !== nextTeamId) {
    //     this.setState({ teamMembersLoaded: false, conversationsLoaded: false });
    //     this.props.fetchTeamMembers(nextTeamId).then(updateTeamMembers);

    //     this.props.fetchConversations(nextTeamId).then(response => {
    //       if (!_.isEmpty(response.data.conversations)) {
    //         const { conversationId } = response.data.conversations[0];
    //         this.props
    //           .fetchMessages(conversationId)
    //           .then(() => this.setState({ conversationsLoaded: true }))
    //           .then(() => {
    //             this.scrollToBottom();
    //             this.setScrollEvent();
    //           });
    //       }
    //       if (response.data === 'STALE') {
    //         this.setState({ conversationsLoaded: true });
    //       }
    //     });
    //   }
    // }

    // const nextPersonalConversation = nextProps.personalConversation;

    // if (!_.isEmpty(nextPersonalConversation) && this.props.personalConversation) {
    //   // Get members data form Users
    //   if (
    //     !_.isEqual(nextProps.users, this.props.users) ||
    //     !_.isEqual(nextPersonalConversation.members, this.state.members)
    //   ) {
    //     const { users, usersPresences } = nextProps;

    //     const members = nextPersonalConversation.members.map(memberId => {
    //       const member = users[memberId];
    //       return {
    //         ...member,
    //         online: _.some(_.values(usersPresences[memberId]), { presenceStatus: 'online' })
    //       };
    //     });

    //     this.setState({ teamMembersLoaded: true, members, membersFiltered: members });
    //   }

    //   if (nextPersonalConversation.conversationId !== this.props.personalConversation.conversationId) {
    //     const { conversationId } = nextPersonalConversation;

    //     this.props
    //       .fetchMessages(conversationId)
    //       .then(() => this.setState({ conversationsLoaded: true }))
    //       .then(() => {
    //         this.scrollToBottom();
    //         this.setScrollEvent();
    //       });
    //   }
    // }
  }

  componentDidUpdate(prevProps) {
    const { teamMembersLoaded, conversationsLoaded } = this.state;

    if (!teamMembersLoaded || !conversationsLoaded) {
      return;
    }

    const { conversation, user } = this.props;
    if (!prevProps.conversation || !conversation) return;
    if (prevProps.conversation.messages.length === conversation.messages.length) return;

    const lastMessage = _.last(conversation.messages) || {};
    const ownMessage = lastMessage.createdBy === user.userId;
    if (ownMessage || this.isNearBottom()) this.scrollToBottom();
  }

  onMessageAction(payload, action) {
    const { message, bookmark, extraInfo } = payload;
    const { user, orgId } = this.props;

    switch (action) {
      case messageAction.replyTo:
        this.setState({ replyTo: { ...message, ...extraInfo } });
        break;
      case messageAction.bookmark:
        this.props
          .saveBookmark(user, orgId, bookmark, extraInfo.setBookmark)
          .then(() => {
            msg.success(String.t(extraInfo.setBookmark ? 'message.bookmarkSetToast' : 'message.bookmarkRemovedToast'));
          })
          .catch(error => msg.error(error.message));
        break;
      case messageAction.delete:
        this.props
          .deleteMessage(message.messageId, message.conversationId)
          .then(() => msg.success(String.t('message.deleteSuccessToast')))
          .catch(error => msg.error(error.message));
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

  handleEditingAction = option => {
    this.setState({ userIsEditing: option });
  };

  handleScroll = () => {
    const messagesContainer = document.getElementsByClassName('team__messages')[0];
    if (!messagesContainer) return;

    const { conversation } = this.props;
    const lastMessage = _.last(conversation.messages) || {};
    if (messagesContainer.scrollHeight === messagesContainer.scrollTop + messagesContainer.clientHeight) {
      this.props.readMessage(lastMessage.messageId, conversation.id);
      messagesContainer.removeEventListener('scroll', this.handleScroll);
    }
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
    const { conversation, user, team, lastReadTimestamp } = this.props;
    const { membersFiltered, lastSubmittedMessage, userIsEditing } = this.state;

    if (!membersFiltered) return null;
    let lastReadExists = false;
    let previousSenderId = null;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;

    return conversation.messages.map(message => {
      if (message.deleted) return null;

      // group messages from the same user
      const sender = membersFiltered.find(member => member.userId === message.createdBy);
      if (!sender) return null;
      const grouped = previousSenderId === sender.userId;
      previousSenderId = sender.userId;

      // If message was created after last read message timestamp
      let lastRead = null;
      if (message.createdBy !== user.userId) {
        lastRead = lastReadExists ? null : lastReadTimestamp < message.created;
        if (lastRead) {
          lastReadExists = true;
          this.setScrollEvent();
        }
      }

      return (
        <ChatMessage
          key={message.messageId}
          message={message}
          teamId={team.teamId}
          conversationId={conversation.id}
          currentPath={currentPath}
          teamMembers={membersFiltered}
          lastRead={lastRead}
          grouped={grouped}
          scrollToBottom={this.scrollToBottom}
          onMessageAction={this.onMessageAction}
          sharedData={message.sharedData}
          showMetadata
          handleEditingAction={this.handleEditingAction}
          userIsEditing={userIsEditing}
        />
      );
    });
  }

  renderMembersTyping() {
    const { membersTyping, user } = this.props;
    const { members } = this.state;
    if (!membersTyping) return null;

    // Remove own user from Typing array
    if (membersTyping[user.userId]) {
      delete membersTyping[user.userId];
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
    const { team, teamMembers, user, conversation, showPageHeader, showTeamMembers, menuOptions } = this.props;
    const { teamMembersLoaded, conversationsLoaded, members, membersFiltered } = this.state;

    if (!teamMembersLoaded || !conversationsLoaded || !user || !teamMembers || !conversation) {
      return <Spinner />;
    }

    const className = classNames({
      'ChatPage-main': true,
      'team-room-chat': true,
      'team-room__main-container--opacity': this.state.isDraggingOver
    });

    return (
      <div className={className}>
        {team && (
          <TopBar
            team={team}
            user={user}
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
        <SimpleCardContainer className="team__messages">{this.renderMessages()}</SimpleCardContainer>

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

export default Chat;
