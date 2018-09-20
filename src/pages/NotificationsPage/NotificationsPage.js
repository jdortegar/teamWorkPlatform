import React, { Component } from 'react';
import classNames from 'classnames';

import String from 'src/translations';
import { NewSubpageHeader } from 'src/components';
import Avatar from 'src/components/common/Avatar';
import './styles/style.css';

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { all: true };
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  onMenuItemClick({ all }) {
    this.setState({ all });
  }

  render() {
    const menuOptionAll = classNames({
      'notification-menu__item': true,
      active: this.state.all
    });
    const menuOptionUnread = classNames({
      'notification-menu__item': true,
      active: this.state.unread
    });
    const menuOptionBookmarked = classNames({
      'notification-menu__item': true,
      active: this.state.bookmarked
    });
    return (
      <div>
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <i className="fa fa-globe fa-2x" />
            <div className="habla-title">{String.t('notificationPage.title')}</div>
          </div>
          <div className="habla-main-content-filters-links">
            <div onClick={() => this.onMenuItemClick({ all: true })} className={menuOptionAll}>
              {String.t('notificationPage.menu.all')}
            </div>
            <div onClick={() => this.onMenuItemClick({ all: true })} className={menuOptionUnread}>
              {String.t('notificationPage.menu.unread')} (12)
            </div>
            <div onClick={() => this.onMenuItemClick({ all: true })} className={menuOptionBookmarked}>
              {String.t('notificationPage.menu.bookmarked')}
            </div>
          </div>
        </NewSubpageHeader>
        <div className="notification-body">
          <div className="notification-body__item unread">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item unread">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item unread">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item unread">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
          <div className="notification-body__item no-border">
            <Avatar />
            <div className="notification-body__item__content">
              <span className="content-name habla-label">Habla AI. Inc</span>
              <p className="content-body">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae aperiam nostrum modi eligendi. Ipsam,
                cupiditate? Et repudiandae mollitia minima repellendus, exercitationem incidunt saepe asperiores
                dignissimos, porro quidem impedit, sed obcaecati!.
                <span className="content-body__time-ago">(11 hours ago)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
