import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Spinner, ChatContent, PageHeader, PersonalCallButton } from 'src/components';
import { AvatarWrapper } from 'src/containers';
import './styles/style.css';

const propTypes = {
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  createConversation: PropTypes.func.isRequired,
  userId: PropTypes.string,
  conversation: PropTypes.object,
  conversationsLoaded: PropTypes.bool,
  makePersonalCall: PropTypes.func.isRequired
};

const defaultProps = {
  userId: null,
  conversation: null,
  conversationsLoaded: false
};

class DirectMessagesPage extends Component {
  state = { orgUsers: null };

  componentDidMount() {
    const { currentUser, users, usersPresences, conversationsLoaded, conversation } = this.props;

    this.updateOrgUsers(users, usersPresences, currentUser);

    if (conversationsLoaded && !conversation) {
      this.props.fetchConversations();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, users, usersPresences, userId, conversationsLoaded, conversation } = nextProps;

    if (usersPresences !== this.props.usersPresences || users !== this.props.users || userId !== this.props.userId) {
      this.updateOrgUsers(users, usersPresences, currentUser);
    }

    // navigated between conversations
    if (userId !== this.props.userId) {
      this.props.fetchConversations();
      return;
    }

    // just fetched conversations data but didn't find a conversation with this user
    if (!conversation && !this.props.conversationsLoaded && conversationsLoaded) {
      this.createConversation(currentUser, users[userId]);
    }
  }

  updateOrgUsers = (users, usersPresences, currentUser) => {
    const orgUsers = [];

    Object.values(users).forEach(user => {
      if (currentUser.userId === user.userId) return;
      orgUsers.push({
        ...user,
        online: _.some(_.values(usersPresences[user.userId]), { presenceStatus: 'online' })
      });
    });

    this.setState({ orgUsers });
  };

  createConversation = (currentUser, member) => {
    this.props.createConversation({
      members: [currentUser.userId, member.userId],
      title: `${currentUser.firstName}, ${member.firstName}`,
      description: `Conversation between ${currentUser.firstName} and ${member.firstName}`
    });
  };

  render() {
    const { conversation, currentUser, userId } = this.props;
    const { orgUsers } = this.state;

    if (!conversation || !orgUsers) {
      return <Spinner />;
    }

    const currentConversationUser = orgUsers.find(orgUser => orgUser.userId === userId);

    return (
      <div className="homePage-main DirectMessages_Page">
        <PageHeader
          optionalButtons={{
            enabled: true,
            content: currentConversationUser && (
              <div>
                {currentConversationUser.online && currentConversationUser.presenceStatus === 'online' && (
                  <PersonalCallButton
                    caller={currentUser.userId}
                    called={currentConversationUser}
                    makePersonalCall={this.props.makePersonalCall}
                  />
                )}
              </div>
            )
          }}
        >
          {currentConversationUser && (
            <div>
              <AvatarWrapper size="default" user={currentConversationUser} hideStatusTooltip />
              <span className="habla-top-menu-label Current_User_Conversation">{currentConversationUser.fullName}</span>
            </div>
          )}
        </PageHeader>
        <div className="homePage__chat-container">
          <ChatContent
            conversationId={conversation.id}
            showTeamMembers={false}
            showPageHeader={false}
            showChat={this.showChat}
          />
        </div>
      </div>
    );
  }
}

DirectMessagesPage.propTypes = propTypes;
DirectMessagesPage.defaultProps = defaultProps;

export default DirectMessagesPage;
