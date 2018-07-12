import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Input, Icon, message } from 'antd';
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
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  state = { query: this.props.query };

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ query: nextProps.query });
    }
  }

  onStatusChange(presenceStatus) {
    const { user } = this.props;
    if (user.presenceStatus && user.presenceStatus === presenceStatus) return;

    this.props.updateUser({ presenceStatus }).catch(error => {
      message.error(error.message);
    });
  }

  logOut() {
    this.props.logoutUser();
  }

  clearInput = () => {
    this.searchInput.focus();
    this.setState({ query: '' });
    this.props.clearSearch();
  };

  handleSearchChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    this.props.history.push(`/app/search?q=${this.state.query}`);
  };

  renderMenuItems() {
    const { user } = this.props;
    const clearIconVisibility = this.state.query ? 'visible' : 'hidden';

    const muteNotificationMenu = (
      <Menu className="muteNotificationMenu">
        <Menu.Item key="header">
          <div className="habla-label padding-class-a">{String.t('Header.muteTitle')}</div>
        </Menu.Item>
        <Menu.Item key="mute30min">
          <a>
            <span>
              <i className="fas fa-volume-up" /> {String.t('Header.muteThirtyMins')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="mute1Hr">
          <a>
            <span>
              <i className="fas fa-volume-down" /> {String.t('Header.muteOneHour')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="mute4Hrs">
          <a>
            <span>
              <i className="fas fa-volume-off" /> {String.t('Header.muteFourHours')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="muteAllDay">
          <a>
            <span>
              <i className="far fa-clock" /> {String.t('Header.muteAllDay')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="muteOff" className="dropdown-last-menu-item">
          <a>
            <span>
              <i className="fas fa-volume-up" /> {String.t('Header.muteNo')}
            </span>
          </a>
        </Menu.Item>
      </Menu>
    );

    const userMenu = (
      <Menu>
        <Menu.Item key="statusHeader">
          <div className="habla-label padding-class-a">{String.t('Header.statusTitle')}</div>
        </Menu.Item>
        <Menu.Item key="online">
          <a onClick={() => this.onStatusChange('online')}>
            <div className="habla-top-navigation-dropdown-signal habla-color-green" />
            {String.t('Header.onlineStatus')}
          </a>
        </Menu.Item>
        <Menu.Item key="away">
          <a onClick={() => this.onStatusChange('away')}>
            <div className="habla-top-navigation-dropdown-signal habla-color-yellow" />
            {String.t('Header.awayStatus')}
          </a>
        </Menu.Item>
        <Menu.Item key="busy">
          <a onClick={() => this.onStatusChange('busy')}>
            <div className="habla-top-navigation-dropdown-signal habla-color-red" />
            {String.t('Header.busyStatus')}
          </a>
        </Menu.Item>
        <Menu.Item key="adminHeader">
          <div className="habla-label padding-class-a">{String.t('Header.adminTitle')}</div>
        </Menu.Item>
        <Menu.Item key="accountSettings">
          <Link to="/app/editUser">
            <span>
              <i className="fas fa-address-card" /> {String.t('Header.accountSettings')}
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="logout" className="dropdown-last-menu-item">
          <a onClick={this.logOut}>
            <i className="fas fa-power-off" /> {String.t('Header.logOutMenu')}
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="habla-top-menu-items">
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <form className="habla-top-menu-search" onSubmit={this.handleSearchSubmit}>
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                placeholder={String.t('Header.smartSearchPlaceholder')}
                onChange={this.handleSearchChange}
                value={this.state.query}
                suffix={
                  <Icon
                    type="close-circle"
                    onClick={this.clearInput}
                    className="habla-top-menu-search-clear"
                    style={{ visibility: clearIconVisibility }}
                  />
                }
              />
              <button type="submit" disabled={this.state.query.length === 0}>
                <i className="fa fa-search" />
              </button>
            </form>
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
            <div className="habla-top-menu-user" style={{ color: '#aaa' }}>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="ant-dropdown-link">
                  <AvatarWrapper size="default" user={user} hideStatusTooltip />
                  <span className="habla-top-menu-label">{user.firstName}</span>
                </div>
              </Dropdown>
            </div>
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
          {this.props.user && this.renderMenuItems()}
          <div className="clear" />
        </div>
      </AntdHeader>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  user: PropTypes.object,
  query: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

Header.defaultProps = {
  clearSearch: null,
  query: '',
  user: null
};

export default Header;
