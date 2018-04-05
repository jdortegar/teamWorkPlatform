import React from 'react';
import PropTypes from 'prop-types';

import { BasicFilter } from 'components';
import imageSrcFromFileExtension from 'lib/imageFiles';
import String from 'translations';

const propTypes = {
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

const FileTypeFilter = ({ count, label, fileExtension, active, onClick, onDoubleClick }) => (
  <BasicFilter
    tooltipTitle={String.t('ckgPage.filterCount', { count, label })}
    imageSource={imageSrcFromFileExtension(fileExtension)}
    label={label}
    active={active}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
  />
);

FileTypeFilter.propTypes = propTypes;
FileTypeFilter.defaultProps = defaultProps;

export default FileTypeFilter;
