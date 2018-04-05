import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'antd';

import './styles/style.css';

const propTypes = {
  tooltipTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

const defaultProps = {
  active: false,
  onClick: null,
  onDoubleClick: null
};

const IMAGE_SIZE = 32;

const BasicFilter = ({ tooltipTitle, label, active, imageSource, onClick, onDoubleClick }) => {
  return (
    <div className="BasicFilter">
      <Tooltip placement="top" title={tooltipTitle}>
        <div
          className={classNames('BasicFilter__content', { inactive: !active })}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <img
            src={imageSource}
            className="BasicFilter__image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            alt=""
          />
          <div className="BasicFilter__label">{label}</div>
        </div>
      </Tooltip>
    </div>
  );
};

BasicFilter.propTypes = propTypes;
BasicFilter.defaultProps = defaultProps;

export default BasicFilter;
