import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';

import imageSrcFromFileExtension from 'src/lib/imageFiles';

const ICON_SIZE = 32;

const FileItem = ({ file, isSelected, onToggleSelection, disabled }) => (
  <div key={file.file_id} className="Tree__item">
    <a className="Tree__item-link">
      <img
        className="Tree__file-icon"
        src={imageSrcFromFileExtension(file.file_type)}
        height={ICON_SIZE}
        width={ICON_SIZE}
        alt=""
      />
      <span className="Tree__file-name">{file.file_name}</span>
    </a>
    <a
      onClick={event => {
        event.stopPropagation();
        onToggleSelection(file.file_id, isSelected);
      }}
      disabled={disabled}
    >
      <Icon
        className={classNames('Tree__item-check-icon', { checked: isSelected })}
        type="check-circle"
        theme="filled"
      />
    </a>
  </div>
);

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  disabled: PropTypes.bool
};

FileItem.defaultProps = {
  isSelected: false,
  disabled: false
};

export default FileItem;
