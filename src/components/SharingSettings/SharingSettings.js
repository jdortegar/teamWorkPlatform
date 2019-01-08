import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Collapse } from 'antd';
import { isEmpty, every, values } from 'lodash';

import String from 'src/translations';
import { SimpleHeader, Tree } from 'src/components';
import './styles/style.css';

const { Panel } = Collapse;

const propTypes = {
  onToggleSelect: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired,
  selectedSettings: PropTypes.object,
  disabled: PropTypes.bool
};

const defaultProps = {
  selectedSettings: {
    folders: [],
    files: [],
    sites: {}
  },
  disabled: false
};

class SharingSettings extends Component {
  toggleFolderSelection = (folderId, site) => {
    this.props.onToggleSelect({ folderId, site });
  };

  toggleFileSelection = (fileId, site) => {
    this.props.onToggleSelect({ fileId, site });
  };

  toggleSelectAll = (event, selectAll) => {
    event.preventDefault();
    this.props.onToggleSelectAll(selectAll);
  };

  render() {
    const { content, selectedSettings, disabled } = this.props;
    const { folders, files, sites } = content;
    const { folders: selectedFolders = [], files: selectedFiles = [], sites: selectedSites = {} } = selectedSettings;

    const isSiteEmpty = site => isEmpty(site.folders) && isEmpty(site.files);
    const selectAll = isEmpty(selectedFolders) && isEmpty(selectedFiles) && every(values(selectedSites), isSiteEmpty);
    const selectAllText = selectAll ? 'selectAll' : 'deselectAll';

    return (
      <div className="SharingSettings">
        <Collapse bordered defaultActiveKey="1">
          <Panel key="1" header={<SimpleHeader text={String.t('integrationPage.sharing.settings')} />}>
            <div className="SharingSettings__title-container">
              <div className="habla-label">{String.t('integrationPage.sharing.foldersAndFiles')}</div>
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
                  const siteSettings = selectedSites[site] || {};
                  return (
                    <Panel key={site} header={<SimpleHeader text={site} />}>
                      <Tree
                        folders={siteContent.folders}
                        files={siteContent.files}
                        selectedFolders={siteSettings.folders}
                        selectedFiles={siteSettings.files}
                        onToggleFolderSelection={folderId => this.toggleFolderSelection(folderId, site)}
                        onToggleFileSelection={fileId => this.toggleFileSelection(fileId, site)}
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
