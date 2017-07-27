import React, { Component } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions';
import './styles/style.css';

const AntdHeader = Layout.Header;

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
      <Menu>
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
                <div className="user-avatar"></div> <span>User Name</span>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUser }, dispatch);
}

export default connect(null, mapDispatchToProps)(Header);
