import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

function MainContent() {
  return (
    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
      Content
    </Content>
  );
}

export default MainContent;
