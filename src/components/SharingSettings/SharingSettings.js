import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { SimpleHeader, Tree } from 'src/components';
import './styles/style.css';

const { Panel } = Collapse;

const propTypes = {
  onToggleSelect: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  integrationType: PropTypes.string,
  folders: PropTypes.array,
  files: PropTypes.array,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array
};

const defaultProps = {
  integrationType: null,
  folders: [],
  files: [],
  selectedFolders: [],
  selectedFiles: []
};

class SharingSettings extends Component {
  toggleFolderSelection = folderId => {
    this.props.onToggleSelect({ folderId });
  };

  toggleFileSelection = fileId => {
    this.props.onToggleSelect({ fileId });
  };

  toggleSelectAll = event => {
    event.preventDefault();
    this.props.onToggleSelectAll();
  };

  render() {
    const { folders, files, selectedFolders, selectedFiles, integrationType } = this.props;
    const selectAllText = isEmpty(selectedFolders) && isEmpty(selectedFiles) ? 'selectAll' : 'deselectAll';
    return (
      <div className="SharingSettings">
        <Collapse bordered defaultActiveKey="1">
          <Panel key="1" header={<SimpleHeader text={String.t('integrationPage.sharing.settings')} />}>
            <div className="SharingSettings__title-container">
              <div className="habla-label">
                {integrationType} {String.t('integrationPage.sharing.foldersAndFiles')}
              </div>
              <div className="habla-label">
                <a onClick={this.toggleSelectAll}>{String.t(`integrationPage.sharing.${selectAllText}`)}</a>
              </div>
            </div>
            <Tree
              folders={folders}
              files={files}
              selectedFolders={selectedFolders}
              selectedFiles={selectedFiles}
              onToggleFolderSelection={this.toggleFolderSelection}
              onToggleFileSelection={this.toggleFileSelection}
            />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

SharingSettings.propTypes = propTypes;
SharingSettings.defaultProps = defaultProps;

export default Form.create()(SharingSettings);
