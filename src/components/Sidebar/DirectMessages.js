import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Input, Icon } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';

import String from 'src/translations';
import { DirectMessageItem } from 'src/containers';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';

import './styles/style.css';

const propTypes = {
  subscribers: PropTypes.array,
  subscribersPresences: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.object
  }).isRequired
};

const defaultProps = {
  subscribers: [],
  subscribersPresences: {}
};

class DirectMessages extends React.Component {
  constructor(props) {
    super(props);

    const { currentUser, subscribers, subscribersPresences } = this.props;
    const orgUsers = [];

    Object.values(subscribers).forEach(user => {
      if (currentUser.userId === user.userId) return;
      if (subscribers.userId === user.userId) return;
      orgUsers.push({
        ...user,
        online: _.some(_.values(subscribersPresences[user.userId]), { presenceStatus: 'online' })
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

      Object.values(subscribers).forEach(user => {
        if (this.props.currentUser.userId === user.userId) return;
        orgUsers.push({
          ...user,
          online: _.some(_.values(subscribersPresences[user.userId]), { presenceStatus: 'online' })
        });
      });

      this.setState({
        orgUsers,
        orgUsersFiltered: orgUsers
      });
    }
  }

  renderOrgMembers = () => {
    const { orgUsersFiltered } = this.state;
    const { pathname } = this.props.history.location;
    const users = _.compact(orgUsersFiltered.sort(sortByName));

    return primaryAtTop(users).map(user => (
      <Menu.Item key={user.userId} className={classNames({ User_active: pathname.includes(user.userId) })}>
        <DirectMessageItem user={user} />
      </Menu.Item>
    ));
  };

  handleSearch = e => {
    const { value } = e.target;
    if (_.isEmpty(value)) {
      this.setState({ orgUsersFiltered: this.state.orgUsers });
      return;
    }

    const orgUsersFiltered = this.state.orgUsers.filter(el =>
      el.fullName.toLowerCase().includes(value.toLowerCase().trim())
    );
    this.setState({ orgUsersFiltered });
  };

  render() {
    const { orgUsersFiltered } = this.state;

    return (
      <div>
        <div className="sidebar-members">
          <div className="sidebar-block-label sidebar-block-label-title">
            <span className="habla-label">
              <span className="sidebar-label-number-text">{String.t('directMessages')}</span>
              {orgUsersFiltered.length > 0 && (
                <span className="sidebar-label-number-badge">{orgUsersFiltered.length}</span>
              )}
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
