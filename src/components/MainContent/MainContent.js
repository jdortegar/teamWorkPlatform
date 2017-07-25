import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

function MainContent() {
  return (
    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
      <h1>Content title</h1>
    </Content>
  );
}

export default MainContent;
