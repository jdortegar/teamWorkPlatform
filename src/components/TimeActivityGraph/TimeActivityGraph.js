import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryScatter, VictoryTheme } from 'victory';

import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

const TimeActivityGraph = ({ files }) => {
  console.warn('FILES:', files);
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domain={{ x: [0, 5], y: [0, 7] }}
    >
      <VictoryScatter
        style={{ data: { fill: '#c43a31' } }}
        size={6}
        data={[
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 4 },
          { x: 5, y: 7 }
        ]}
      />
    </VictoryChart>
  );
};

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
