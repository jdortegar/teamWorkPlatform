import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

import FileImage from '../FileImage';
import String from '../../translations';
import formatSize from '../../lib/formatSize';

const propTypes = {
  file: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number,
  borderWidth: PropTypes.number,
  visible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func
};

const defaultProps = {
  radius: 6,
  borderWidth: 1,
  visible: false,
  onVisibleChange: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {}
};

const DataPoint = ({
  file,
  x,
  y,
  radius,
  borderWidth,
  visible,
  onVisibleChange,
  onMouseOver,
  onMouseOut
}) => {
  const title = (
    <div className="DataPoint__title">
      <FileImage extension={file.extension} />
      <a href={file.resourceUri} target="_blank">
        {file.filename}
      </a>
    </div>
  );
  const content = (
    <div>
      <p>{String.t('timeActivityGraph.displayTime', file)}</p>
      <p>{formatSize(file.fileSize)}</p>
    </div>
  );
  return (
    <Popover
      key={file.fileId}
      content={content}
      title={title}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <circle
        r={radius}
        cx={x}
        cy={y}
        fill={file.color}
        stroke="#333"
        strokeWidth={borderWidth}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
    </Popover>
  );
};

DataPoint.propTypes = propTypes;
DataPoint.defaultProps = defaultProps;

export default DataPoint;
