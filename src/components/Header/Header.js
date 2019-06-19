import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Input, Icon, message, Select, Divider } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import String from 'src/translations';
import { CKG_VIEWS } from 'src/actions';
import { AvatarWrapper } from 'src/containers';
import { paths } from 'src/routes';
import { hablaBlackLogo, hablaBlackLogoIcon } from 'src/img';
import SearchMenu from './SearchMenu';
import './styles/style.css';

const propTypes = {
  logoutUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  toggleCaseSensitive: PropTypes.func.isRequired,
  toggleExactMatch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  globalSearch: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  changeCKGView: PropTypes.func.isRequired,
  user: PropTypes.object,
  teamId: PropTypes.string,
  query: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const defaultProps = {
  query: '',
  caseSensitive: false,
  exactMatch: false,
  user: null,
  teamId: null
};

const AntdHeader = Layout.Header;

const { Option } = Select;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.query,
      showInput: false,
      dropdownVisible: false
    };

    this.logOut = this.logOut.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query || nextProps.query !== this.state.query) {
      this.setState({ query: nextProps.query });
    }
  }

  onStatusChange(presenceStatus, statusMessage) {
    const { user } = this.props;
    if (user.presenceStatus && user.presenceStatus === presenceStatus) return;

    this.props
      .updateUser({ presenceStatus, statusMessage }, user.userId)
      .then(() => {
        message.success(String.t('Header.statusUpdated'));
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  handleSounds = option => {
    const { user } = this.props;
    const notificationsTimer = option ? moment().add(option, 'minutes') : false;

    // Save status on db.
    const { preferences } = user;
    preferences.muteNotifications = notificationsTimer;

    // if option < 60
    const timeFormat = option <= 60 ? option : option / 60;

    this.props
      .updateUser({ preferences }, user.userId)
      .then(() => {
        if (option && option <= 1440) {
          message.success(
            String.t('Header.mutedFor', { option: timeFormat, format: option <= 60 ? 'minutes' : 'hours' })
          );
        } else if (option > 1440) {
          message.success(String.t('Header.soundsMuted'));
        } else {
          message.success(String.t('Header.unMuted'));
        }
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  clearSearchInput = () => {
    this.searchInput.focus();
    this.setState({ query: '' });

    this.props.clearSearch();
    this.props.search();
    this.props.changeCKGView(CKG_VIEWS.FILE_LIST);
  };

  handleSearchChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    const { teamId, caseSensitive, exactMatch, history, search, globalSearch } = this.props;
    const { query } = this.state;
    search(query, { teamId, caseSensitive, exactMatch });
    if (query.length > 0) {
      globalSearch(query, { all: true, caseSensitive, exactMatch });
    }
    history.push(paths.ckg);
  };

  initZendesk = () => {
    const iframe = document.getElementById('launcher');
    const launcher = iframe.contentDocument.querySelector('.src-component-launcher-WidgetLauncher-wrapper');
    launcher.click();
  };

  handleStatusSelect = value => {
    const { user } = this.props;
    // If status is the same, return.
    const customPresenceStatusMessage = value;
    if (user.preferences.statusMessage && user.preferences.customPresenceStatusMessage === customPresenceStatusMessage)
      return;

    // If status is custom change to input field.
    if (customPresenceStatusMessage === 'custom') {
      this.setState({
        showInput: true
      });

      return;
    }

    // Save status on db.
    const { preferences } = user;
    preferences.customPresenceStatusMessage = customPresenceStatusMessage;

    this.props
      .updateUser({ preferences }, user.userId)
      .then(() => {
        message.success(String.t('Header.statusUpdated'));
      })
      .catch(error => {
        message.error(error.message);
      });
  };

  handleDropdownVisibility = val => {
    this.setState({
      dropdownVisible: val
    });
  };

  handleSelectOptions = () => {
    this.setState({
      showInput: false
    });
  };

  logOut() {
    this.props.logoutUser();
  }

  renderMenuItems() {
    const { user, caseSensitive, exactMatch, toggleCaseSensitive, toggleExactMatch } = this.props;
    const { showInput } = this.state;
    const clearIconVisibility = this.state.query ? 'visible' : 'hidden';
    const { muteNotifications } = user.preferences;

    const muteNotificationMenu = (
      <Menu className="muteNotificationMenu">
        <Menu.Item key="header">
          <div className="habla-label padding-class-a">{String.t('Header.muteTitle')}</div>
        </Menu.Item>
        <Menu.Item key="mute30min">
          <a onClick={() => this.handleSounds(30)}>
            <span>
              <i className="fas far fa-clock" /> {String.t('Header.muteThirtyMins')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="mute1Hr">
          <a onClick={() => this.handleSounds(60)}>
            <span>
              <i className="fas far fa-clock" /> {String.t('Header.muteOneHour')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="mute2Hrs">
          <a onClick={() => this.handleSounds(120)}>
            <span>
              <i className="fas far fa-clock" /> {String.t('Header.muteTwoHours')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="mute4Hrs">
          <a onClick={() => this.handleSounds(240)}>
            <span>
              <i className="fas far fa-clock" /> {String.t('Header.muteFourHours')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="muteAllDay">
          <a onClick={() => this.handleSounds(1440)}>
            <span>
              <i className="far fa-clock" /> {String.t('Header.muteAllDay')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item key="muteOff" className="dropdown-last-menu-item">
          <a onClick={() => this.handleSounds(muteNotifications ? false : 518400)}>
            <span>
              {muteNotifications && (
                <span>
                  <i className="fas fa-volume-up" /> {String.t('Header.muteNo')}
                </span>
              )}
              {!muteNotifications && (
                <span>
                  <i className="fas fa-volume-mute" /> {String.t('Header.mute')}
                </span>
              )}
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
        <Menu.Item key="statusMessageHeader">
          <div className="habla-label padding-class-a">{String.t('Header.statusMessageTitle')}</div>
        </Menu.Item>
        <Menu.Item key="statusMessage">
          {!showInput && (
            <Select
              showSearch
              defaultValue={String.t('Header.available')}
              style={{ width: '100%', zIndex: 9999 }}
              className="px-10"
              onChange={this.handleStatusSelect}
              value={user.preferences.customPresenceStatusMessage || String.t('Header.available')}
            >
              <Option value={String.t('Header.available')}>{String.t('Header.available')}</Option>
              <Option value={String.t('Header.dontDisturb')}>{String.t('Header.dontDisturb')}</Option>
              <Option value={String.t('Header.inAMeeting')}>{String.t('Header.inAMeeting')}</Option>
              <Option value={String.t('Header.onVacations')}>{String.t('Header.onVacations')}</Option>
              <Option value="custom">{String.t('Header.custom')}</Option>
            </Select>
          )}
          {showInput && (
            <div className="px-10 Header__Status_input">
              <Input
                size="small"
                placeholder={String.t('Header.writeAMessage')}
                style={{ width: '100%' }}
                onBlur={e => this.handleStatusSelect(e.target.value)}
                onPressEnter={e => this.handleStatusSelect(e.target.value)}
                suffix={<Icon type="close" onClick={this.handleSelectOptions} />}
              />
            </div>
          )}
        </Menu.Item>
        <Menu.Item key="divider">
          <Divider style={{ margin: '15px auto', width: '90%', minWidth: '90%', background: '#7d7d7d' }} />
        </Menu.Item>
        <Menu.Item key="accountSettings">
          <Link to={`/app/editUser/${user.userId}`}>
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

    const supportMenu = (
      <Menu>
        <Menu.Item key="statusHeader">
          <div className="habla-label padding-class-a">{String.t('Header.supportTitle')}</div>
        </Menu.Item>
        <Menu.Item key="instantSupport">
          <a onClick={() => this.initZendesk()}>
            <i className="fas fa-question-circle" /> {String.t('Header.instantSupport')}
          </a>
        </Menu.Item>
        <Menu.Item key="submitTicket" className="submitTicketContainer">
          <a rel="noopener noreferrer" href="https://hablaaisupport.zendesk.com/hc/en-us/requests/new" target="_blank">
            <i className="fas fa-ticket-alt" /> {String.t('Header.submitTicket')}
          </a>
        </Menu.Item>
        <Menu.Item key="goHelpCenter">
          <a rel="noopener noreferrer" href="https://hablaaisupport.zendesk.com/hc/en-us" target="_blank">
            <i className="fas fa-share-square" /> {String.t('Header.goHelpCenter')}
          </a>
        </Menu.Item>
      </Menu>
    );

    const className = classNames('habla-top-menu-item', { 'habla-top-menu-item-last': !this.state.isAdmin });

    return (
      <div className="habla-top-menu-items">
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <form className="habla-top-menu-search" onSubmit={this.handleSearchSubmit}>
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                className="habla-top-menu-search-input"
                placeholder={String.t('Header.smartSearchPlaceholder')}
                onChange={this.handleSearchChange}
                value={this.state.query}
                suffix={
                  <Icon
                    type="close-circle"
                    className="habla-top-menu-search-clear"
                    onClick={this.clearSearchInput}
                    style={{ visibility: clearIconVisibility }}
                  />
                }
              />
              <button type="submit">
                <i className="fa fa-search" />
              </button>
              <SearchMenu
                caseSensitive={caseSensitive}
                exactMatch={exactMatch}
                onToggleCaseSensitive={toggleCaseSensitive}
                onToggleExactMatch={toggleExactMatch}
              />
            </form>
          </div>
        </div>
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <Dropdown overlay={muteNotificationMenu} trigger={['click']} placement="bottomRight">
              <div className="ant-dropdown-link">
                <span className="habla-top-menu-notification-sounds">
                  {muteNotifications && (
                    <span>
                      <i className="fa fa-volume-mute" />
                    </span>
                  )}
                  {!muteNotifications && (
                    <span>
                      <i className="fa fa-volume-up" />
                    </span>
                  )}
                  <Icon type="down" className="userMenu__dropdown-icon" />
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className="habla-top-menu-item">
          <div className="habla-top-menu-item-content">
            <Dropdown overlay={supportMenu} trigger={['click']} placement="bottomRight">
              <div className="ant-dropdown-link">
                <span className="habla-top-menu-help-center">
                  <i className="far fa-question-circle" />
                  <Icon type="down" className="userMenu__dropdown-icon" />
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className={className}>
          <div className="habla-top-menu-item-content">
            <div className="habla-top-menu-user" style={{ color: '#aaa' }}>
              <Dropdown
                overlay={userMenu}
                placement="bottomRight"
                visible={this.state.dropdownVisible}
                trigger={['click']}
                onVisibleChange={val => this.handleDropdownVisibility(val)}
              >
                <div className="ant-dropdown-link">
                  <AvatarWrapper size="default" user={user} hideStatusTooltip showDetails={false} />
                  <span className="habla-top-menu-label">{user.firstName}</span>
                  <Icon type="down" className="userMenu__dropdown-icon" />
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

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
