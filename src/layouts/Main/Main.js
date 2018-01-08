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


function Main() {
  return (
    <Layout>
      <Header />
      <Layout className="ant-layout-has-sider">
        <Sidebar />
        <Layout className="habla-main-content">
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
