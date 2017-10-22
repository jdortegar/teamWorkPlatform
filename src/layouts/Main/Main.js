import React from 'react';
import { Layout } from 'antd';
import Header from '../../containers/Header';
import Sidebar from '../../containers/Sidebar';
import MainContent from '../../containers/MainContent';
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
        <Layout style={{ padding: '20px 24px 20px 259px' }}>
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
