import React, { Component } from 'react';
import { Layout } from 'antd';
import FileDrop from 'react-file-drop';
import TeamRoomPage from '../../containers/TeamRoomPage';

const { Content } = Layout;

class ChatContent extends Component {
  constructor(props) {
    super(props);

    this.state = { fileList: [], isDraggingOver: false };

    this.updateFileList = this.updateFileList.bind(this);
    this.clearFileList = this.clearFileList.bind(this);
  }

  updateFileList(fileList) {
    this.setState({ fileList: [...fileList], isDraggingOver: false });
  }

  clearFileList() {
    this.setState({ fileList: [] });
  }

  render() {
    return (
      <FileDrop
        onDrop={this.updateFileList}
        onFrameDragEnter={() => this.setState({ isDraggingOver: true })}
        onFrameDragLeave={() => this.setState({ isDraggingOver: false })}
        frame={document}
        targetAlwaysVisible
      >
        <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
          <div>
            <TeamRoomPage
              files={this.state.fileList}
              updateFileList={this.updateFileList}
              isDraggingOver={this.state.isDraggingOver}
              clearFileList={this.clearFileList}
            />
          </div>
        </Content>
      </FileDrop>
    );
  }
}

export default ChatContent;
