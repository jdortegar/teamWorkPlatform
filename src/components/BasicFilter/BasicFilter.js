import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import './styles/style.css';

const propTypes = {
  tooltipTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  avatar: PropTypes.element,
  imageSource: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

const defaultProps = {
  active: false,
  avatar: null,
  imageSource: '',
  onClick: null,
  onDoubleClick: null
};

const IMAGE_SIZE = 32;

const BasicFilter = ({ tooltipTitle, label, active, avatar, imageSource, onClick, onDoubleClick }) => {
  const image = avatar || (
    <img src={imageSource} className="BasicFilter__image" width={IMAGE_SIZE} height={IMAGE_SIZE} alt="" />
  );
  return (
    <div className="BasicFilter">
      <Tooltip placement="top" title={tooltipTitle}>
        <div
          className={classNames('BasicFilter__content', { inactive: !active })}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          {image}
          <div className="BasicFilter__label">{label}</div>
        </div>
      </Tooltip>
    </div>
  );
};

BasicFilter.propTypes = propTypes;
BasicFilter.defaultProps = defaultProps;

export default BasicFilter;
