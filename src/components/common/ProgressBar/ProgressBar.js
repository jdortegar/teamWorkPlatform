import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Progress as AntdProgress } from 'antd';
import './styles/style.css';

const propTypes = {
  ...AntdProgress.propTypes,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  strokeColor: PropTypes.string,
  percent: PropTypes.number,
  showInfo: PropTypes.bool,
  containerWidth: PropTypes.string
};

const defaultProps = {
  type: 'line',
  disabled: false,
  strokeColor: '#384f83',
  percent: 0,
  showInfo: false,
  containerWidth: '50%'
};

const CLASSNAME = 'habla-progress';

function ProgressBar(props) {
  const { type, disabled, strokeColor, percent, containerWidth, ...rest } = props;
  const className = classNames(CLASSNAME, `${CLASSNAME}--type-${type}`);

  return (
    <div className={className} style={{ width: containerWidth }}>
      <AntdProgress strokeColor={strokeColor} percent={percent} type={type} disabled={disabled} {...rest} />
    </div>
  );
}

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
ProgressBar.Group = AntdProgress.Group;
export default ProgressBar;
