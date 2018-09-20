import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line global-require, import/no-dynamic-require
const requireImageFile = fileName => require(`src/img/file-types/${fileName}.png`);

const FileImage = ({ extension, size }) => {
  let file;
  try {
    file = requireImageFile(extension.toLowerCase());
  } catch (e) {
    file = requireImageFile('file');
  }

  return <img src={file} style={{ width: size, height: size }} alt={extension} />;
};

FileImage.defaultProps = {
  size: 30
};

FileImage.propTypes = {
  extension: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default FileImage;
