import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import Header from '../../components/Header';
import Sidebar from '../../containers/Sidebar';
import MainContent from '../../components/MainContent';
import { AddOrgDialog, OrgSettingsDialog, InvitePeopleDialog } from '../../containers/dialogs';
import Chat from '../../containers/Chat';
import { routesPaths } from '../../routes';

function Main() {
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
          <Switch>
            <Route exact path={routesPaths.chat} component={Chat} />
            <MainContent />
          </Switch>
          <AddOrgDialog />
          <InvitePeopleDialog />
          <OrgSettingsDialog />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Main;
