import React, { Component } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserIcon from '../UserIcon';
import { hablaBlackLogo } from '../../img';
import './styles/style.css';

const AntdHeader = Layout.Header;

const propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logoutUser();
  }

  render() {
    const { user } = this.props;
    const menu = (
      <Menu >
        <Menu.Item key="accountSettings">
          <Link to={`/app/editUser/${user.userId}`}>
            <span>Account Settings</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={this.logOut}>Log Out</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <AntdHeader className="header">
        <img src={hablaBlackLogo} alt="Habla AI Logo" className="logo" />
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Dropdown overlay={menu} trigger={['click']}>
              <div className="Header__user-container">
                <div className="ant-dropdown-link">
                  <UserIcon user={user} type="user" shape="square" minWidth="35px" width="35px" height="35px" />
                </div>
                <span className="Header__full-name-span">{user.firstName}</span>
              </div>
            </Dropdown>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/app/notifications">
              <i className="fa fa-globe fa-2x" /><span>Notifications</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/app/ckg">
              <i className="fa fa-area-chart fa-2x" /><span>CKG</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4"><i className="fa fa-search fa-2x" /><span>Search</span></Menu.Item>
        </Menu>
      </AntdHeader>
    );
  }
}

Header.propTypes = propTypes;

export default Header;
