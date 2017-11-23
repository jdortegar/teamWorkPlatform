import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Avatar,
  NewSubpageHeader
} from '../../components';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  sideBarIsHidden: PropTypes.bool.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: true,
      messages: false,
      replies: false,
      notifications: false
    };

    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  componentWillMount() {
    if (!this.props.sideBarIsHidden) {
      this.props.toggleSideBar();
    }
  }

  componentWillUnmount() {
    this.props.toggleSideBar();
  }

  onMenuItemClick(all, messages, replies, notifications) {
    this.setState({
      all,
      messages,
      replies,
      notifications
    });
  }

  render() {
    const menuOptionAll = classNames({
      'notification-menu__item': true,
      active: this.state.all
    });
    const menuOptionMessages = classNames({
      'notification-menu__item': true,
      active: this.state.messages
    });
    const menuOptionReplies = classNames({
      'notification-menu__item': true,
      active: this.state.replies
    });
    const menuOptionNotifications = classNames({
      'notification-menu__item': true,
      active: this.state.notifications
    });
    return (
      <div>
        <NewSubpageHeader>
          <div className="notificationHeader-title display-row">
            <div className="icon-wrapper">
              <i className="fa fa-globe fa-2x" />
            </div>
            <div className="subpage__header__title ">{String.t('notificationPage.title')}</div>
          </div>
          <div className="notificationHeader-options display-row">
            <div onClick={() => this.onMenuItemClick(true, false, false, false)} className={menuOptionAll}>{String.t('notificationPage.menu.all')}</div>
            <div onClick={() => this.onMenuItemClick(false, true, false, false)} className={menuOptionMessages}>{String.t('notificationPage.menu.messages')}</div>
            <div onClick={() => this.onMenuItemClick(false, false, true, false)} className={menuOptionReplies}>{String.t('notificationPage.menu.replies')}</div>
            <div onClick={() => this.onMenuItemClick(false, false, false, true)} className={menuOptionNotifications}>{String.t('notificationPage.menu.notifications')}</div>
          </div>
        </NewSubpageHeader>
        <div className="notification-body">
          <div className="notification-body__unread">
            <span className="total-unread">3 {String.t('notificationPage.unReadNotifications')} - </span>
            <span className="mark-as-read">{String.t('notificationPage.markAllAsRead')}</span>
          </div>
          <div className="notification-body__item new">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item new">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item new last-new">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
            <span className="last-new__text">NEW</span>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar
              iconColor={this.props.user.preferences.iconColor}
              image={this.props.user.icon || this.props.user.preferences.avatarBase64}
              styles={{ width: '2.8em', height: '2.8em' }}
              name={this.props.user.displayName}
            />
            <div className="notification-body__item__content">
              <span className="content-name">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam
                nostrum modi eligendi. Ipsam, cupiditate? Et repudiandae mollitia minima
                repellendus, exercitationem incidunt saepe asperiores dignissimos, porro
                quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NotificationsPage.propTypes = propTypes;
