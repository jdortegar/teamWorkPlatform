import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Collapse } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { SimpleHeader, Tree } from 'src/components';
import './styles/style.css';

const { Panel } = Collapse;

const propTypes = {
  onToggleSelect: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired,
  integrationType: PropTypes.string,
  selectedFolders: PropTypes.array,
  selectedFiles: PropTypes.array,
  disabled: PropTypes.bool
};

const defaultProps = {
  integrationType: null,
  selectedFolders: [],
  selectedFiles: [],
  disabled: false
};

class SharingSettings extends Component {
  toggleFolderSelection = folderId => {
    this.props.onToggleSelect({ folderId });
  };

  toggleFileSelection = fileId => {
    this.props.onToggleSelect({ fileId });
  };

  toggleSelectAll = (event, selectAll) => {
    event.preventDefault();
    this.props.onToggleSelectAll(selectAll);
  };

  render() {
    const { content, selectedFolders, selectedFiles, integrationType, disabled } = this.props;
    const { folders, files, sites } = content;
    const selectAll = isEmpty(selectedFolders) && isEmpty(selectedFiles);
    const selectAllText = selectAll ? 'selectAll' : 'deselectAll';
    console.warn({ content });
    return (
      <div className="SharingSettings">
        <Collapse bordered defaultActiveKey="1">
          <Panel key="1" header={<SimpleHeader text={String.t('integrationPage.sharing.settings')} />}>
            <div className="SharingSettings__title-container">
              <div className="habla-label">
                {integrationType} {String.t('integrationPage.sharing.foldersAndFiles')}
              </div>
              <div className={classNames('habla-label', { disabled })}>
                <a onClick={e => this.toggleSelectAll(e, selectAll)} disabled={disabled}>
                  {String.t(`integrationPage.sharing.${selectAllText}`)}
                </a>
              </div>
            </div>
            {isEmpty(sites) && (
              <Tree
                folders={folders}
                files={files}
                selectedFolders={selectedFolders}
                selectedFiles={selectedFiles}
                onToggleFolderSelection={this.toggleFolderSelection}
                onToggleFileSelection={this.toggleFileSelection}
                disabled={disabled}
              />
            )}
            {!isEmpty(sites) && (
              <Collapse bordered>
                {sites.map(site => {
                  const siteContent = content[site] || {};
                  return (
                    <Panel key={site} header={<SimpleHeader text={site} />}>
                      <Tree
                        folders={siteContent.folders}
                        files={siteContent.files}
                        selectedFolders={selectedFolders}
                        selectedFiles={selectedFiles}
                        onToggleFolderSelection={this.toggleFolderSelection}
                        onToggleFileSelection={this.toggleFileSelection}
                        disabled={disabled}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

SharingSettings.propTypes = propTypes;
SharingSettings.defaultProps = defaultProps;

export default Form.create()(SharingSettings);
