import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import imageSrcFromFileExtension from 'lib/imageFiles';
import String from 'translations';
import './styles/style.css';

const propTypes = {
  fileTypeKey: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  fileExtension: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

const defaultProps = {
  active: false,
  fileExtension: null,
  onClick: null,
  onDoubleClick: null
};

const FileTypeFilter = ({ fileTypeKey, count, label, fileExtension, active, onClick, onDoubleClick }) => (
  <div key={fileTypeKey} className="FileTypeFilter">
    <Tooltip placement="top" title={String.t('ckgPage.filterCount', { count, label })}>
      <div
        className={classNames('FileTypeFilter__content', { inactive: !active })}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={imageSrcFromFileExtension(fileExtension)}
          className="FileTypeFilter__image"
          width={32}
          height={32}
          alt=""
        />
        <div className="FileTypeFilter__label">{label}</div>
      </div>
    </Tooltip>
  </div>
);

FileTypeFilter.propTypes = propTypes;
FileTypeFilter.defaultProps = defaultProps;

export default FileTypeFilter;
