import React from 'react';
import PropTypes from 'prop-types';

import './styles/style.css';

const propTypes = {
  assets: PropTypes.array
};

const defaultProps = {
  assets: []
};

const AssetsFilters = ({ assets }) => (
  <div className="AssetsFilters">
    {assets.map(asset => (
      <div key={asset.label} className="AssetsFilters__filter">
        <div className="AssetsFilters__dot" style={{ backgroundColor: asset.color }} />
        <span className="AssetsFilters__label">{asset.label}</span>
      </div>
    ))}
  </div>
);

AssetsFilters.propTypes = propTypes;
AssetsFilters.defaultProps = defaultProps;

export default AssetsFilters;
