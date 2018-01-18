import React, { Component } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserIcon from '../UserIcon';
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

    const menu = (
      <Menu >
        <Menu.Item key="accountSettings">
          <Link to="/app/editUser">
            <span>{String.t('Header.accountSettings')}</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={this.logOut}>{String.t('Header.logOutMenu')}</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="habla-top-menu-items">
        <Link to="/app/search" className="habla-top-menu-search">
          <i className="fa fa-search fa-2x" /><span className="habla-top-menu-label">{String.t('Header.searchLink')}</span>
          <div className="habla-top-menu-active-signal" />
        </Link>
        <Link to="/app/ckg" className="habla-top-menu-ckg">
          <i className="fa fa-area-chart fa-2x" /><span className="habla-top-menu-label">{String.t('Header.ckgLink')}</span>
          <div className="habla-top-menu-active-signal" />
        </Link>
        <Link to="/app/notifications" className="habla-top-menu-notifications">
          <i className="fa fa-globe fa-2x" /><span className="habla-top-menu-label">{String.t('Header.noticationsLink')}</span>
          <div className="habla-top-menu-active-signal" />
        </Link>
        <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
          <i className="fa fa-bookmark fa-2x" /><span className="habla-top-menu-label">{String.t('Header.bookmarksLink')}</span>
          <div className="habla-top-menu-active-signal" />
        </Link>
        <Link to="/app" className="habla-top-menu-user">
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="ant-dropdown-link">
              <div className="habla-top-menu-subitem">
                <UserIcon
                  user={user}
                  type="user"
                  minWidth="30px"
                  width="30px"
                  height="30px"
                />
              </div>
              <span className="habla-top-menu-label">{user.firstName}</span>
            </div>
          </Dropdown>
          <div className="habla-top-menu-active-signal" />
        </Link>
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
