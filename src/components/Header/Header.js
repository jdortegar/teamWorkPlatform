import React, { Component } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const AntdHeader = Layout.Header;

const propTypes = {
  logoutUser: PropTypes.func.isRequired
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
    const menu = (
      <Menu >
        <Menu.Item key="logout">
          <a onClick={this.logOut}>Log Out</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <AntdHeader className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <div className="user-avatar"></div><span>Thomas Knapp</span><div className="clear" />
              </a>
            </Dropdown>
          </Menu.Item>
          <Menu.Item key="2"><i className="fa fa-globe fa-2x" aria-hidden="true"></i><span>Notifications</span></Menu.Item>
          <Menu.Item key="3"><i className="fa fa-area-chart fa-2x" aria-hidden="true"></i><span>CKG</span></Menu.Item>
          <Menu.Item key="4"><i className="fa fa-search fa-2x" aria-hidden="true"></i><span>Search</span></Menu.Item>
        </Menu>
      </AntdHeader>
    );
  }
}

Header.propTypes = propTypes;

export default Header;
