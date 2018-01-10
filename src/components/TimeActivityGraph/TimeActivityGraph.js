import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryZoomContainer
} from 'victory';

import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// from the beginning of the last year until now
const DATE_DOMAIN = [moment().subtract(1, 'year').startOf('year'), moment()];
const TIME_DOMAIN = [moment().endOf('day'), moment().startOf('day')];

// one month from the last file
const defaultZoomDomain = (files) => {
  const lastFileDate = moment.max(files.map(file => file.date));
  return [moment(lastFileDate).subtract(1, 'month'), moment(lastFileDate).add(1, 'day')];
};

const TimeActivityGraph = ({ files }) => {
  console.warn('FILES', files);
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      scale={{ x: 'time', y: 'time' }}
      domain={{ x: DATE_DOMAIN, y: TIME_DOMAIN }}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={{ x: defaultZoomDomain(files) }}
        />
      }
    >
      <VictoryAxis />
      <VictoryAxis
        invertAxis
        dependentAxis
        tickFormat={x => moment(x).format('HH:mm')}
      />
      <VictoryScatter
        style={{ data: { fill: '#c43a31' } }}
        size={3}
        data={files}
        x="date"
        y="time"
      />
    </VictoryChart>
  );
};

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
