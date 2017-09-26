import React, { Component } from 'react';
import { Layout } from 'antd';
import FileDrop from 'react-file-drop';
import TeamRoomPage from '../../containers/TeamRoomPage';

const { Content } = Layout;

class ChatContent extends Component {
  constructor(props) {
    super(props);

    this.state = { fileList: [] };

    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop(files) {
    // console.log(files);
    const reader = new FileReader();
    reader.onload = (e => {
      // console.log(e);
    });
    // console.log(reader);
    reader.readAsDataURL(files[0]);
    console.log([...files]);
    this.setState({ fileList: [...files] });
  }

  render() {
    return (
      <FileDrop onDrop={this.handleDrop} frame={document} targetAlwaysVisible>
        <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
          <div>
            <TeamRoomPage files={this.state.fileList} />
          </div>
        </Content>
      </FileDrop>
    );
  }
}

export default ChatContent;
