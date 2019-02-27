import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import { Spinner, ChatContent, PageHeader, AvatarWrapper, PersonalCallButton } from 'src/components';
import { Input, Icon, Badge, message } from 'antd';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  org: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  usersPresences: PropTypes.object.isRequired,
  createConversation: PropTypes.func.isRequired,
  currentPersonalConversation: PropTypes.object,
  userId: PropTypes.string,
  readMessagesByConversationId: PropTypes.object,
  conversations: PropTypes.object,
  makePersonalCall: PropTypes.func.isRequired,
  readMessage: PropTypes.func.isRequired,
  transcripts: PropTypes.object.isRequired
};

const defaultProps = {
  currentPersonalConversation: null,
  userId: null,
  readMessagesByConversationId: {},
  conversations: {}
};

class DirectMessagesPage extends Component {
  constructor(props) {
    super(props);

    const { user, users, usersPresences, currentPersonalConversation } = this.props;

    const orgUsers = [];

    Object.values(users).forEach(userEl => {
      if (user.userId === userEl.userId) return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(usersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    let currentConversationUser = null;

    if (currentPersonalConversation) {
      const lastUser = currentPersonalConversation.members.find(memberId => memberId !== user.userId);
      currentConversationUser = orgUsers.find(userEl => userEl.userId === lastUser);
    }

    this.state = {
      teamMembersLoaded: true,
      orgUsers,
      orgUsersFiltered: orgUsers,
      currentConversationUser
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    if (userId) {
      this.handleConversation(userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.usersPresences === this.props.usersPresences && nextProps.users === this.props.users) return;

    const { users, usersPresences, currentPersonalConversation } = nextProps;

    const orgUsers = [];

    Object.values(users).forEach(userEl => {
      if (this.props.user.userId === userEl.userId) return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(usersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    let currentConversationUser = null;

    if (currentPersonalConversation) {
      const lastUser = currentPersonalConversation.members.find(memberId => memberId !== this.props.user.userId);
      currentConversationUser = orgUsers.find(userEl => userEl.userId === lastUser);
    }

    this.setState({
      orgUsers,
      orgUsersFiltered: orgUsers,
      currentConversationUser
    });
  }

  handleConversation = userId => {
    const { org, user, currentPersonalConversation, readMessagesByConversationId } = this.props;
    const { orgUsers } = this.state;
    const valuesToSend = {
      orgId: org.subscriberOrgId,
      members: [user.userId, userId]
    };

    this.props.createConversation(valuesToSend).catch(error => {
      message.error(error.message);
    });

    const currentConversationUser = orgUsers.find(orgUser => orgUser.userId === userId);

    this.setState({
      currentConversationUser
    });

    let unreadMessages;

    if (currentPersonalConversation) {
      const { conversationId } = currentPersonalConversation;
      const readMessages = readMessagesByConversationId[conversationId] || {};
      unreadMessages = readMessages.messageCount - (readMessages.lastReadMessageCount || 0);
    }

    if (unreadMessages > 0) {
      this.clearUnreadMessages();
    }
  };

  renderConversationUsers = () => {
    const { orgUsersFiltered } = this.state;
    const { user, conversations, readMessagesByConversationId, currentPersonalConversation } = this.props;

    return orgUsersFiltered.map(userEl => {
      let unreadMessages = 0;
      let conversationId = null;
      const conversation = Object.values(conversations).find(conversationEl => {
        if (conversationEl.teamId) return null;
        return _.xor(conversationEl.members, [user.userId, userEl.userId]).length === 0;
      });

      if (conversation) {
        // eslint-disable-next-line prefer-destructuring
        conversationId = conversation.conversationId;
        const readMessages = readMessagesByConversationId[conversationId] || {};
        unreadMessages = readMessages.messageCount - (readMessages.lastReadMessageCount || 0);
      }

      return (
        <div
          key={userEl.userId}
          className={classNames({
            User_Container: true,
            active: currentPersonalConversation && conversationId === currentPersonalConversation.conversationId
          })}
          onClick={() => this.handleConversation(userEl.userId)}
        >
          <div className="UserName_Container">
            <AvatarWrapper size="default" user={userEl} hideStatusTooltip />
            <span className="habla-top-menu-label">{userEl.fullName}</span>
          </div>
          {unreadMessages > 0 && (
            <Badge
              count={unreadMessages}
              title="Unread Messages"
              style={{ backgroundColor: '#5b7eba' }}
              overflowCount={999999}
            />
          )}
        </div>
      );
    });
  };

  handleSearch = e => {
    const { value } = e.target;
    if (value === '') {
      this.setState({ orgUsersFiltered: this.state.orgUsers });
    } else {
      const orgUsersFiltered = this.state.orgUsers.filter(el =>
        el.fullName.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ orgUsersFiltered });
    }
  };

  clearUnreadMessages() {
    const { currentPersonalConversation, transcripts } = this.props;
    const { conversationId } = currentPersonalConversation;
    const lastMessage =
      transcripts && transcripts[conversationId] ? _.last(transcripts[conversationId].flattenedTree) : {};

    this.props.readMessage(lastMessage.messageId, conversationId);
  }

  render() {
    const { org, currentPersonalConversation, conversations, user } = this.props;
    const { teamMembersLoaded, currentConversationUser } = this.state;

    if (!teamMembersLoaded || !org || !conversations) {
      return <Spinner />;
    }

    return (
      <div className="homePage-main DirectMessages_Page">
        <PageHeader
          pageBreadCrumb={{
            routes: [{ title: String.t('directMessagesPage.title') }]
          }}
          optionalButtons={{
            enabled: true,
            content: currentConversationUser && (
              <div>
                <span className="habla-top-menu-label Current_User_Conversation">
                  {currentConversationUser.fullName}
                </span>
                <AvatarWrapper size="default" user={currentConversationUser} hideStatusTooltip />
                {currentConversationUser.online && (
                  <PersonalCallButton
                    caller={user.userId}
                    called={currentConversationUser}
                    makePersonalCall={this.props.makePersonalCall}
                  />
                )}
              </div>
            )
          }}
        />
        <div className="DirecMessages_Container">
          <div className="DirectMessages_Conversations">
            <div className="UsersHeader">
              <div className="sidebar-block-label sidebar-block-label-title">
                <span className="habla-label">
                  <span className="sidebar-label-number-text">{String.t('teamsMembers')}</span>
                  <span className="sidebar-label-number-badge">{this.state.orgUsers.length}</span>
                </span>
              </div>
              <div className="UserSearch_Container">
                <Input
                  prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={this.handleSearch}
                />
              </div>
            </div>
            {this.renderConversationUsers()}
          </div>
          <div className="DirectMessages__ChatBody">
            {currentPersonalConversation && (
              <ChatContent
                showTeamMembers={false}
                showPageHeader={false}
                showChat={this.showChat}
                personalConversation={currentPersonalConversation}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

DirectMessagesPage.propTypes = propTypes;
DirectMessagesPage.defaultProps = defaultProps;

export default DirectMessagesPage;
