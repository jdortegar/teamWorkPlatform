import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme
} from 'victory';

import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

const TimeActivityGraph = ({ files }) => {
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryScatter
        style={{ data: { fill: '#c43a31' } }}
        size={3}
        data={files}
        x={'date'}
        y={'time'}
      />
    </VictoryChart>
  );
};

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
