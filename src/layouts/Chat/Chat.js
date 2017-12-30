import React from 'react';
import { Layout } from 'antd';
import Header from '../../containers/Header';
import Sidebar from '../../containers/Sidebar';
import ChatContent from '../../containers/ChatContent';
import { AddOrgDialog } from '../../containers/dialogs';

function Chat() {
  return (
    <Layout>
      <Header />
      <Layout className="ant-layout-has-sider">
        <Sidebar />
        <Layout style={{ padding: '20px 24px 20px 259px' }}>
          <ChatContent />
          <AddOrgDialog />
        </Layout>
      </Layout>
    </Layout>
  );
}


export default Chat;
