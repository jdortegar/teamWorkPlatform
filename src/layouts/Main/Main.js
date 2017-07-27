import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import Header from '../../components/Header';
import Sidebar from '../../containers/Sidebar';
import MainContent from '../../components/MainContent';
import { AddOrgDialog,
  OrgSettingsDialog,
  InvitePeopleDialog,
  AddTeamDialog,
  AddTeamRoomDialog
} from '../../containers/dialogs';
import './styles/main.css';
import '../styles/habla-brand-styles.css';

function Main() {
  return (
    <Layout>
      <Header />
      <Layout className="ant-layout-has-sider">
        <Sidebar />
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '12px 0' }}>
            <Breadcrumb.Item>Organization Name</Breadcrumb.Item>
            <Breadcrumb.Item>Team Name</Breadcrumb.Item>
            <Breadcrumb.Item>Team Room Name</Breadcrumb.Item>
          </Breadcrumb>
          <MainContent />
          <AddOrgDialog />
          <AddTeamDialog />
          <InvitePeopleDialog />
          <OrgSettingsDialog />
          <AddTeamRoomDialog />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Main;
