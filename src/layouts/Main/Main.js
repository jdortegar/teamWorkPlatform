import React from 'react';
import { Layout } from 'antd';
import Header from '../../containers/Header';
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

function Main(props) {
  console.log(props);
  return (
    <Layout>
      <Header />
      <Layout className="ant-layout-has-sider">
        <Sidebar />
        <Layout style={{ padding: '91px 24px 24px 259px' }}>
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
