import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Spinner, ChatContent, PageHeader, AvatarWrapper, PersonalCallButton } from 'src/components';
import { message } from 'antd';
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
  conversations: PropTypes.object,
  makePersonalCall: PropTypes.func.isRequired
};

const defaultProps = {
  currentPersonalConversation: null,
  userId: null,
  conversations: {}
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
    const { org, user, users, usersPresences, userId } = this.props;

    const orgUsers = [];

    Object.values(users).forEach(userEl => {
      if (user.userId === userEl.userId) return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(usersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    this.setState({ orgUsers });

    const valuesToSend = {
      orgId: org.subscriberOrgId,
      members: [user.userId, userId]
    };

    this.props
      .createConversation(valuesToSend)
      .then(() => {
        this.setState({ teamMembersLoaded: true });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  componentWillReceiveProps(nextProps) {
    const { users, usersPresences, userId, org, user } = nextProps;
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
      this.setState({ teamMembersLoaded: false });

      const valuesToSend = {
        orgId: org.subscriberOrgId,
        members: [user.userId, userId]
      };

      this.props
        .createConversation(valuesToSend)
        .then(() => {
          this.setState({ teamMembersLoaded: true });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  render() {
    const { currentPersonalConversation, conversations, user, userId } = this.props;
    const { teamMembersLoaded, orgUsers } = this.state;

    if (!conversations || !orgUsers) {
      return <Spinner />;
    }

    const currentConversationUser = orgUsers.find(orgUser => orgUser.userId === userId);

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
        />
        {teamMembersLoaded ? (
          <ChatContent
            showTeamMembers={false}
            showPageHeader={false}
            showChat={this.showChat}
            personalConversation={currentPersonalConversation}
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

DirectMessagesPage.propTypes = propTypes;
DirectMessagesPage.defaultProps = defaultProps;

export default DirectMessagesPage;
