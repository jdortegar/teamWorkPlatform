import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';

class Main extends Component {
  render() {
    return (
      <Layout>
        <Header />
        <Layout className="ant-layout-has-sider">
          <Sidebar />
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <MainContent />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Main;
