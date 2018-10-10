import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Collapse } from 'antd';

import String from 'src/translations';

const { Panel } = Collapse;

const FolderItem = ({ folder, isSelected, onToggleSelection, children }) => (
  <div key={folder.folder_id}>
    <Collapse>
      <Panel
        showArrow={false}
        header={
          <div className="Tree__item">
            <a className="Tree__item-link">
              <Icon type="folder" theme="filled" className="Tree__folder-icon" />
              <span className="Tree__folder-name">{folder.folder_name}</span>
              <span>
                {String.t('integrationDetailsPage.sharing.itemsCount', {
                  count: folder.folders.length + folder.files.length
                })}
              </span>
            </a>
            <a
              onClick={event => {
                event.stopPropagation();
                onToggleSelection(folder.folder_id, isSelected);
              }}
            >
              <Icon
                type="check-circle"
                theme="filled"
                className={classNames('Tree__item-check-icon', { checked: isSelected })}
              />
            </a>
          </div>
        }
      >
        <div className="Tree__subtree">{children}</div>
      </Panel>
    </Collapse>
  </div>
);

FolderItem.propTypes = {
  folder: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  children: PropTypes.node
};

FolderItem.defaultProps = {
  isSelected: false,
  children: null
};

export default FolderItem;
