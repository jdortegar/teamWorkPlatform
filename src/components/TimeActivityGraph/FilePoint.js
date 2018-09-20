import React from 'react';
import PropTypes from 'prop-types';

import imageSrcFromFile from 'src/lib/imageFiles';

const ICON_SIZE = 32;

const propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  datum: PropTypes.object,
  events: PropTypes.object
};

const defaultProps = {
  datum: undefined,
  x: undefined,
  y: undefined,
  events: {}
};

const FilePoint = ({ x, y, datum, events }) => {
  if (!x || !y || !datum) return null;

  return (
    <foreignObject x={x} y={y} height={ICON_SIZE} width={ICON_SIZE} {...events}>
      <img src={imageSrcFromFile(datum.fileExtension)} width={ICON_SIZE} height={ICON_SIZE} alt={datum.fileName} />
    </foreignObject>
  );
};

FilePoint.propTypes = propTypes;
FilePoint.defaultProps = defaultProps;

export default FilePoint;
