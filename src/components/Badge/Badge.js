import React from 'react';
import PropTypes from 'prop-types';

import './styles/style.css';

const propTypes = {
  count: PropTypes.number,
  styles: PropTypes.object
};

const defaultProps = {
  count: 0,
  styles: {}
};

const Badge = ({ count, styles }) => {
  return count > 0 && (
    <div className="Badge" style={styles}>
      {count}
    </div>
  );
};

Badge.propTypes = propTypes;
Badge.defaultProps = defaultProps;

export default Badge;
