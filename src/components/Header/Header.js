import React from 'react';
import { Layout, Menu } from 'antd';
import './styles/style.css';

const AntdHeader = Layout.Header;

function Header() {
  return (
    <AntdHeader className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >        
        <Menu.Item key="1"><div className="user-avatar"></div> User Name</Menu.Item>
        <Menu.Item key="2"><i className="fa fa-globe fa-2x" aria-hidden="true"></i>Notifications</Menu.Item>
        <Menu.Item key="3"><i className="fa fa-area-chart fa-2x" aria-hidden="true"></i>CKG</Menu.Item>
        <Menu.Item key="4"><i className="fa fa-search fa-2x" aria-hidden="true"></i>Search</Menu.Item>
      </Menu>
    </AntdHeader>
  );
}

export default Header;
