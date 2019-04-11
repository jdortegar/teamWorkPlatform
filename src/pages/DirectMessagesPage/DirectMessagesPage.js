import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Spinner, ChatContent, PageHeader, PersonalCallButton } from 'src/components';
import { AvatarWrapper } from 'src/containers';
import { message } from 'antd';
import './styles/style.css';

const propTypes = {
  org: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
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
  constructor(props) {
    super(props);

    this.state = {
      teamMembersLoaded: false,
      orgUsers: null
    };
  }

  componentDidMount() {
    const { org, user, users, usersPresences, userId, conversationsLoaded, conversation } = this.props;

    const orgUsers = [];

    Object.values(users).forEach(userEl => {
      if (user.userId === userEl.userId) return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(usersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    this.setState({ orgUsers });

    // const valuesToSend = {
    //   orgId: org.subscriberOrgId,
    //   members: [user.userId, userId]
    // };

    if (conversationsLoaded && conversation) {
      this.setState({ teamMembersLoaded: true });
    }

    // this.props
    //   .createConversation(valuesToSend)
    //   .then(() => {
    //     this.setState({ teamMembersLoaded: true });
    //   })
    //   .catch(error => {
    //     message.error(error.message);
    //   });
  }

  componentWillReceiveProps(nextProps) {
    const { users, usersPresences, userId, org, user, conversationsLoaded, conversation } = nextProps;
    // Update org Users if change some property
    if (usersPresences !== this.props.usersPresences || users !== this.props.users || userId !== this.props.userId) {
      const orgUsers = [];

      Object.values(users).forEach(userEl => {
        if (this.props.user.userId === userEl.userId) return;
        orgUsers.push({
          ...userEl,
          online: _.some(_.values(usersPresences[userEl.userId]), { presenceStatus: 'online' })
        });
      });

      this.setState({
        orgUsers
      });
    }

    // Update conversation
    if (userId !== this.props.userId) {
      if (conversationsLoaded && conversation) {
        this.setState({ teamMembersLoaded: true });
      }
      // const valuesToSend = {
      //   orgId: org.subscriberOrgId,
      //   members: [user.userId, userId]
      // };
      // this.props
      //   .createConversation(valuesToSend)
      //   .then(() => {
      //     this.setState({ teamMembersLoaded: true });
      //   })
      //   .catch(error => {
      //     message.error(error.message);
      //   });
    }
  }

  render() {
    const { conversation, user, userId } = this.props;
    const { teamMembersLoaded, orgUsers } = this.state;

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
                {currentConversationUser.online && currentConversationUser.presenceStatus !== 'busy' && (
                  <PersonalCallButton
                    caller={user.userId}
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
          {teamMembersLoaded ? (
            <ChatContent
              conversationId={conversation.id}
              showTeamMembers={false}
              showPageHeader={false}
              showChat={this.showChat}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

DirectMessagesPage.propTypes = propTypes;
DirectMessagesPage.defaultProps = defaultProps;

export default DirectMessagesPage;
