import React from 'react';
import PropTypes from 'prop-types';

import String from '../../translations';
import './styles/style.css';

const propTypes = {
  count: PropTypes.number,
  styles: PropTypes.object
};

const defaultProps = {
  count: 0,
  styles: {}
};

const Badge = ({ count, styles }) =>
  count > 0 && (
    <div className="Badge" style={styles}>
      {count > 99 ? String.t('sideBar.badgeTopLimit') : count}
    </div>
  );

Badge.propTypes = propTypes;
Badge.defaultProps = defaultProps;

export default Badge;
