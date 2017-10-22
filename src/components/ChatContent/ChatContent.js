import React, { Component } from 'react';
import { Layout } from 'antd';
import FileDrop from 'react-file-drop';
import PropTypes from 'prop-types';
import TeamRoomPage from '../../containers/TeamRoomPage';
import Notification from '../../containers/Notification';
import { sound1 } from '../../sounds';

const { Content } = Layout;

const propTypes = {
  invitation: PropTypes.array.isRequired
};

class ChatContent extends Component {
  constructor(props) {
    super(props);

    this.state = { fileList: [], isDraggingOver: false };

    this.updateFileList = this.updateFileList.bind(this);
    this.removeFileFromList = this.removeFileFromList.bind(this);
    this.clearFileList = this.clearFileList.bind(this);
    this.addBase = this.addBase.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.length > this.props.invitation) {
      const audio = new Audio(sound1);
      audio.play();
    }
  }

  removeFileFromList(fileToRemove) {
    const files = this.state.fileList.filter(file => file !== fileToRemove);
    this.setState({
      fileList: files
    });
  }

  updateFileList(fileList) {
    this.setState({
      fileList: [
        ...this.state.fileList,
        ...fileList
      ],
      isDraggingOver: false
    });
  }

  addBase(file, binary) {
    const files = this.state.fileList.map((el) => {
      if (el === file) {
        const newFile = el;
        newFile.src = binary;
        return newFile;
      }

      return el;
    });
    this.setState({ fileList: files });
  }

  clearFileList() {
    this.setState({ fileList: [] });
  }

  render() {
    const { invitation } = this.props;
    return (
      /* <div className="chat-wrapper">
        <h1>asdmadmask</h1>
      </div> */
      <FileDrop
        onDrop={this.updateFileList}
        onFrameDragEnter={() => this.setState({ isDraggingOver: true })}
        onFrameDragLeave={() => this.setState({ isDraggingOver: false })}
        frame={document}
        targetAlwaysVisible
      >
        <Content style={{ background: '#fff', margin: 0, height: '85vh' }}>
          {invitation.length > 0 ? invitation.map(el => <Notification options={el} />) : null}
          <TeamRoomPage
            files={this.state.fileList}
            updateFileList={this.updateFileList}
            removeFileFromList={this.removeFileFromList}
            isDraggingOver={this.state.isDraggingOver}
            clearFileList={this.clearFileList}
            addBase={this.addBase}
          />
        </Content>
      </FileDrop>
    );
  }
}

ChatContent.propTypes = propTypes;

export default ChatContent;
