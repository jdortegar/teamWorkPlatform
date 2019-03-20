import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { Menu, Input, Icon } from 'antd';
import { AvatarWrapper, Badge } from 'src/components';

import './styles/style.css';

const propTypes = {
  conversations: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.object
  }).isRequired,
  messagesByConversation: PropTypes.object.isRequired,
  readMessagesByConversationId: PropTypes.object,
  readMessage: PropTypes.func.isRequired,
  subscribers: PropTypes.array,
  subscribersPresences: PropTypes.object,
  user: PropTypes.object.isRequired
};

const defaultProps = {
  conversations: {},
  subscribers: [],
  subscribersPresences: {},
  readMessagesByConversationId: {}
};

class DirectMessages extends React.Component {
  constructor(props) {
    super(props);

    const { user, subscribers, subscribersPresences } = this.props;
    const orgUsers = [];

    Object.values(subscribers).forEach(userEl => {
      if (user.userId === userEl.userId) return;
      if (subscribers.userId === userEl.userId) return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(subscribersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    this.state = {
      orgUsers,
      orgUsersFiltered: orgUsers
    };
  }

  componentWillReceiveProps(nextProps) {
    const { subscribers, subscribersPresences } = nextProps;
    // Update org Users if change some property
    if (subscribersPresences !== this.props.subscribersPresences || subscribers !== this.props.subscribers) {
      const orgUsers = [];

      Object.values(subscribers).forEach(userEl => {
        if (this.props.user.userId === userEl.userId) return;
        orgUsers.push({
          ...userEl,
          online: _.some(_.values(subscribersPresences[userEl.userId]), { presenceStatus: 'online' })
        });
      });

      this.setState({
        orgUsers,
        orgUsersFiltered: orgUsers
      });
    }
  }

  handleConversation = (userId, conversationId, unreadMessages) => {
    const { messagesByConversation } = this.props;

    this.props.history.push(`/app/chat/${userId}`);
    if (unreadMessages > 0) {
      const lastMessage = messagesByConversation[conversationId]
        ? _.last(messagesByConversation[conversationId].messagesList)
        : {};

      this.props.readMessage(lastMessage.messageId, conversationId);
    }
  };

  renderOrgMembers = () => {
    const { orgUsersFiltered } = this.state;
    const { conversations, user, readMessagesByConversationId } = this.props;

    let orgUserOrdered = orgUsersFiltered.sort(sortByName);

    orgUserOrdered = orgUserOrdered.length === 0 && orgUserOrdered[0] === undefined ? [] : primaryAtTop(orgUserOrdered);

    return orgUserOrdered.map(userEl => {
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

      const userActive = classNames({ User_active: this.props.history.location.pathname.indexOf(userEl.userId) > 1 });

      return (
        <Menu.Item key={userEl.userId} className={userActive}>
          <div
            className="habla-left-navigation-team-list"
            onClick={() => this.handleConversation(userEl.userId, conversationId, unreadMessages)}
          >
            <div className="habla-left-navigation-team-list-item">
              <div className="habla-left-navigation-team-list-subitem">
                <AvatarWrapper size="default" user={userEl} hideStatusTooltip />
                <span className="habla-left-navigation-item-label">{userEl.fullName}</span>
              </div>
              {unreadMessages > 0 && <Badge count={unreadMessages} className="SideBar__Badge" overflowCount={999999} />}
            </div>
          </div>
        </Menu.Item>
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

  render() {
    const { orgUsersFiltered } = this.state;

    return (
      <div>
        <div className="sidebar-members">
          <div className="sidebar-block-label sidebar-block-label-title">
            <span className="habla-label">
              <span className="sidebar-label-number-text">{String.t('directMessages')}</span>
              <span className="sidebar-label-number-badge">{orgUsersFiltered.length}</span>
            </span>
          </div>

          <div className="sidebar-actions Sidebar-actions_inside-box">
            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleSearch} />
          </div>

          <div className="organization-list">
            <Menu mode="inline" className="habla-left-navigation-list habla-left-navigation-organization-list">
              {this.renderOrgMembers()}
            </Menu>
          </div>
        </div>
      </div>
    );
  }
}

DirectMessages.propTypes = propTypes;
DirectMessages.defaultProps = defaultProps;

export default DirectMessages;
