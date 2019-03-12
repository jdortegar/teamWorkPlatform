import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Input, Icon, message, Button, Switch, Divider } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import { AvatarWrapper } from 'src/components';
import { hablaBlackLogo, hablaBlackLogoIcon } from 'src/img';
import SearchMenu from './SearchMenu';
import './styles/style.css';

const propTypes = {
  logoutUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  toggleCaseSensitive: PropTypes.func.isRequired,
  toggleExactMatch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired,
  user: PropTypes.object,
  teamId: PropTypes.string,
  query: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  isAdminMode: PropTypes.bool.isRequired,
  setAdminMode: PropTypes.func.isRequired
};

const defaultProps = {
  query: '',
  caseSensitive: false,
  exactMatch: false,
  user: null,
  teamId: null
};

const AntdHeader = Layout.Header;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.query
    };

    this.logOut = this.logOut.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.handleAdminButton = this.handleAdminButton.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query || nextProps.query !== this.state.query) {
      this.setState({ query: nextProps.query });
    }
  }

  onStatusChange(presenceStatus) {
    const { user } = this.props;
    if (user.presenceStatus && user.presenceStatus === presenceStatus) return;

    this.props
      .updateUser({ presenceStatus }, user.userId)
      .then(() => {
        message.success(String.t('Header.statusUpdated'));
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  clearSearchInput = () => {
    this.searchInput.focus();
    this.setState({ query: '' });

    this.props.clearSearch();
    this.props.search();
  };

  handleSearchChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    const { teamId, caseSensitive, exactMatch } = this.props;
    this.props.search(this.state.query, { teamId, caseSensitive, exactMatch });
  };

  initZendesk = () => {
    const iframe = document.getElementById('launcher');
    const launcher = iframe.contentDocument.querySelector('.src-component-launcher-WidgetLauncher-wrapper');
    launcher.click();
  };

  handleAdminButton(checked) {
    this.props.setAdminMode(checked);
  }

  logOut() {
    this.props.logoutUser();
  }

  renderMenuItems() {
    const {
      user,
      caseSensitive,
      exactMatch,
      toggleCaseSensitive,
      toggleExactMatch,
      isAdminMode,
      currentSubscriberOrgId
    } = this.props;
    const clearIconVisibility = this.state.query ? 'visible' : 'hidden';

    const isOrgAdmin =
      Object.keys(user.subscriberOrgs).length > 0 && user.subscriberOrgs[currentSubscriberOrgId].role === 'admin';

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
        {isOrgAdmin ? (
          <Menu.Item key="adminHeader">
            <div className="habla-label padding-class-a">{String.t('Header.adminTitle')}</div>
          </Menu.Item>
        ) : (
          <Menu.Item key="divider">
            <Divider style={{ margin: '5px auto', width: '90%', minWidth: '90%', background: '#7d7d7d' }} />
          </Menu.Item>
        )}
        <Menu.Item key="accountSettings">
          <Link to={`/app/editUser/${user.userId}`}>
            <span>
              <i className="fas fa-address-card" /> {String.t('Header.accountSettings')}
            </span>
          </Link>
        </Menu.Item>
        {isOrgAdmin && (
          <Menu.Item key="adminMode">
            <a>
              <span>
                <i className="fas fa-sync-alt" /> {String.t('Header.adminMode')}{' '}
                <Switch
                  size="small"
                  defaultChecked
                  style={{ marginLeft: 10 }}
                  onChange={this.handleAdminButton}
                  checked={isAdminMode}
                />
              </span>
            </a>
          </Menu.Item>
        )}
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
              <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                <div className="ant-dropdown-link">
                  <AvatarWrapper size="default" user={user} hideStatusTooltip />
                  <span className="habla-top-menu-label">{user.firstName}</span>
                  <Icon type="down" className="userMenu__dropdown-icon" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        {this.props.isAdminMode && (
          <div className="habla-top-menu-item habla-top-menu-item-admin">
            <div className="habla-top-menu-item-content">
              <Button
                type="primary"
                size="small"
                block
                className="adminRoleButton"
                onClick={() => this.props.history.push(`/app/editOrganization/${currentSubscriberOrgId}/teams`)}
              >
                {String.t('roles.admin')}
              </Button>
            </div>
          </div>
        )}
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
