import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';

import FolderItem from './FolderItem';
import FileItem from './FileItem';
import './styles/style.css';

const propTypes = {
  folders: PropTypes.array,
  files: PropTypes.array,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array,
  onToggleFolderSelection: PropTypes.func.isRequired,
  onToggleFileSelection: PropTypes.func.isRequired
};

const defaultProps = {
  folders: [],
  files: [],
  selectedFolders: [],
  selectedFiles: []
};

class Tree extends Component {
  renderFolders = folders => {
    const { selectedFolders } = this.props;
    return folders.map(folder => (
      <FolderItem
        key={folder.folder_id}
        folder={folder}
        isSelected={includes(selectedFolders, folder.folder_id)}
        onToggleSelection={this.props.onToggleFolderSelection}
      >
        {this.renderTree(folder.folders, folder.files)}
      </FolderItem>
    ));
  };

  renderFiles = files => {
    const { selectedFiles } = this.props;
    return files.map(file => (
      <FileItem
        key={file.file_id}
        file={file}
        isSelected={includes(selectedFiles, file.file_id)}
        onToggleSelection={this.props.onToggleFileSelection}
      />
    ));
  };

  renderTree = (folders, files) => (
    <div>
      {this.renderFolders(folders)}
      {this.renderFiles(files)}
    </div>
  );

  render() {
    const { folders, files } = this.props;

    return <div className="Tree">{this.renderTree(folders, files)}</div>;
  }
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;

export default Tree;
