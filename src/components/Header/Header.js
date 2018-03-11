import React, { Component } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AvatarWrapper from 'components/common/Avatar/AvatarWrapper';
import { hablaBlackLogo, hablaBlackLogoIcon } from '../../img';
import './styles/style.css';
import String from '../../translations';

const AntdHeader = Layout.Header;

class Header extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logoutUser();
  }

  renderMenuItems() {
    const { user } = this.props;

    const muteNotificationMenu = (
      <Menu className="muteNotificationMenu">
        <Menu.Item key="header">
          <div className="habla-label padding-class-a">{String.t('Header.muteTitle')}</div>
        </Menu.Item>
        <Menu.Item key="mute30min">
          <a><span><i className="fas fa-volume-up" /> {String.t('Header.muteThirtyMins')}</span></a>
        </Menu.Item>
        <Menu.Item key="mute1Hr">
          <a><span><i className="fas fa-volume-down" /> {String.t('Header.muteOneHour')}</span></a>
        </Menu.Item>
        <Menu.Item key="mute4Hrs">
          <a><span><i className="fas fa-volume-off" /> {String.t('Header.muteFourHours')}</span></a>
        </Menu.Item>
        <Menu.Item key="muteAllDay">
          <a><span><i className="far fa-clock" /> {String.t('Header.muteAllDay')}</span></a>
        </Menu.Item>
        <Menu.Item key="muteOff" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-volume-up" /> {String.t('Header.muteNo')}</span></a>
        </Menu.Item>
      </Menu>
    );

    const userMenu = (
      <Menu className="userMenu">
        <Menu.Item key="statusHeader">
          <div className="habla-label padding-class-a">{String.t('Header.statusTitle')}</div>
        </Menu.Item>
        <Menu.Item key="online">
          <a><div className="habla-top-navigation-dropdown-signal habla-color-green" /> {String.t('Header.onlineStatus')}</a>
        </Menu.Item>
        <Menu.Item key="away">
          <a><div className="habla-top-navigation-dropdown-signal habla-color-yellow" />  {String.t('Header.awayStatus')}</a>
        </Menu.Item>
        <Menu.Item key="busy">
          <a><div className="habla-top-navigation-dropdown-signal habla-color-red" />  {String.t('Header.busyStatus')}</a>
        </Menu.Item>
        <Menu.Item key="adminHeader">
          <div className="habla-label padding-class-a">{String.t('Header.adminTitle')}</div>
        </Menu.Item>
        <Menu.Item key="accountSettings">
          <Link to="/app/editUser">
            <span><i className="fas fa-cog" /> {String.t('Header.accountSettings')}</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="logout" className="dropdown-last-menu-item">
          <a onClick={this.logOut}><i className="fas fa-power-off" /> {String.t('Header.logOutMenu')}</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="habla-top-menu-items">
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <input className="habla-header-search-input" placeholder={String.t('Header.semanticSearchPlaceholder')} />
            <Link to="/app/search" className="habla-top-menu-search ">
              <i className="fa fa-search" />
            </Link>
          </div>
        </div>
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <Link to="" className="habla-top-menu-notification-sounds">
              <Dropdown overlay={muteNotificationMenu} trigger={['click']}>
                <div className="ant-dropdown-link">
                  <i className="fa fa-volume-up" />
                </div>
              </Dropdown>
            </Link>
          </div>
        </div>
        <div className="habla-top-menu-item habla-top-menu-item-last">
          <div className="habla-top-menu-item-content">
            <Link to="/app" className="habla-top-menu-user">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="ant-dropdown-link">
                  <div className="habla-top-menu-subitem">
                    <div className="habla-top-navigation-avatar-signal habla-color-green" />
                    <AvatarWrapper size="default" user={user} />
                  </div>
                  <span className="habla-top-menu-label">{user.firstName}</span>
                </div>
              </Dropdown>
            </Link>
          </div>
        </div>
        <div className="clear" />
      </div>
    );
  }

  render() {
    return (
      <AntdHeader className="header habla-top-menu">
        <div className="habla-top-menu-content">
          <div className="logo habla-top-menu-logo">
            <Link to="/app">
              <img src={hablaBlackLogo} alt={String.t('Header.logoAlt')} className="logo habla-logo-image" />
              <img src={hablaBlackLogoIcon} alt={String.t('Header.iconAlt')} className="habla-logo-image-responsive" />
            </Link>
          </div>
          {this.props.user && this.props.logoutUser &&
          this.renderMenuItems()
          }
          <div className="clear" />
        </div>
      </AntdHeader>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func,
  user: PropTypes.object
};

Header.defaultProps = {
  logoutUser: null,
  user: null
};

export default Header;
