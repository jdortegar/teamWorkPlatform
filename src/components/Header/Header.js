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
        <Menu.Item key="1">Notifications</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </AntdHeader>
  );
}

export default Header;
