import React from 'react';
import PropTypes from 'prop-types';

import imageSrcFromFile from '../../lib/imageFiles';

const ICON_SIZE = 32;

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  datum: PropTypes.object.isRequired,
  events: PropTypes.object
};

const defaultProps = {
  events: {}
};

const FilePoint = ({ x, y, datum, events }) => {
  if (!x || !y || !datum) return null;

  return (
    <foreignObject
      x={x}
      y={y}
      height={ICON_SIZE}
      width={ICON_SIZE}
      {...events}
    >
      <img
        src={imageSrcFromFile(datum)}
        width={ICON_SIZE}
        height={ICON_SIZE}
        alt={datum.fileName}
      />
    </foreignObject>
  );
};

FilePoint.propTypes = propTypes;
FilePoint.defaultProps = defaultProps;

export default FilePoint;
