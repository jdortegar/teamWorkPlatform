import React, { Component } from 'react';
import { Layout } from 'antd';
import FileDrop from 'react-file-drop';
import TeamRoomPage from '../../containers/TeamRoomPage';

const { Content } = Layout;

class ChatContent extends Component {
  render() {
    return (
      <FileDrop onDrop={() => alert()} frame={document} targetAlwaysVisible>
        <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
          <div>
            <TeamRoomPage />
          </div>
        </Content>
      </FileDrop>
    );
  }
}

export default ChatContent;
