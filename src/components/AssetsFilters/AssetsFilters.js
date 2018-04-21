import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './styles/style.css';

const propTypes = {
  assets: PropTypes.array,
  excludeFilter: PropTypes.object,
  onFilterClick: PropTypes.func
};

const defaultProps = {
  assets: [],
  excludeFilter: {},
  onFilterClick: () => {}
};

const AssetsFilters = ({ assets, excludeFilter, onFilterClick }) => (
  <div className="AssetsFilters">
    {assets.map(({ label, color }) => (
      <div
        key={label}
        className={classNames('AssetsFilters__filter', { inactive: excludeFilter[label] })}
        onClick={() => onFilterClick(label)}
      >
        <div className="AssetsFilters__dot" style={{ backgroundColor: color }} />
        <span className="AssetsFilters__label">{label}</span>
      </div>
    ))}
  </div>
);

AssetsFilters.propTypes = propTypes;
AssetsFilters.defaultProps = defaultProps;

export default AssetsFilters;
