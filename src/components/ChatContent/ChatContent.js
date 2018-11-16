import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Layout } from 'antd';
import FileDrop from 'react-file-drop';
import { Chat } from 'src/containers';

const propTypes = {
  showPageHeader: PropTypes.bool,
  showTeamMembers: PropTypes.bool,
  showChat: PropTypes.func,
  menuOptions: PropTypes.array,
  teamId: PropTypes.string.isRequired
};

const defaultProps = {
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null,
  menuOptions: []
};

const { Content } = Layout;

class ChatContent extends Component {
  constructor(props) {
    super(props);

    this.state = { fileList: [], isDraggingOver: false };

    this.updateFileList = this.updateFileList.bind(this);
    this.removeFileFromList = this.removeFileFromList.bind(this);
    this.clearFileList = this.clearFileList.bind(this);
    this.addBase = this.addBase.bind(this);
  }

  removeFileFromList(fileToRemove) {
    const files = this.state.fileList.filter(file => file !== fileToRemove);
    this.setState({
      fileList: files
    });
  }

  updateFileList(fileList) {
    const filesToState = [...fileList].filter(file => {
      const fileFound = this.state.fileList.find(fileInState => fileInState.name === file.name);
      return !fileFound;
    });
    this.setState({
      fileList: [...this.state.fileList, ...filesToState],
      isDraggingOver: false
    });
  }

  addBase(file, binary) {
    const files = this.state.fileList.map(el => {
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
    return (
      <FileDrop
        onDrop={this.updateFileList}
        onFrameDragEnter={() => this.setState({ isDraggingOver: true })}
        onFrameDragLeave={() => this.setState({ isDraggingOver: false })}
        frame={document}
        targetAlwaysVisible
      >
        <Content style={{ background: '#fff', margin: 0, display: 'flex', flex: 1 }}>
          <Chat
            teamId={this.props.teamId}
            files={this.state.fileList}
            updateFileList={this.updateFileList}
            removeFileFromList={this.removeFileFromList}
            isDraggingOver={this.state.isDraggingOver}
            clearFileList={this.clearFileList}
            addBase={this.addBase}
            showTeamMembers={this.props.showTeamMembers}
            showPageHeader={this.props.showPageHeader}
            showChat={this.props.showChat}
            menuOptions={this.props.menuOptions}
          />
        </Content>
      </FileDrop>
    );
  }
}

ChatContent.propTypes = propTypes;
ChatContent.defaultProps = defaultProps;

export default ChatContent;
