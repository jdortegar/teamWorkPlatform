import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer
} from 'victory';

import styles from './styles/style';

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
  return [moment(lastFileDate).subtract(2, 'weeks'), moment(lastFileDate).add(1, 'day')];
};

const TimeActivityGraph = ({ files }) => {
  console.warn('FILES', files);
  return (
    <VictoryChart
      scale={{ x: 'time', y: 'time' }}
      domain={{ x: DATE_DOMAIN, y: TIME_DOMAIN }}
      width={styles.container.width}
      height={styles.container.height}
      padding={styles.container.padding}
      style={styles.container}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={{ x: defaultZoomDomain(files) }}
        />
      }
    >
      <VictoryAxis
        style={{
          axis: styles.hidden,
          tickLabels: styles.tickLabels,
          grid: styles.lines
        }}
      />
      <VictoryAxis
        invertAxis
        dependentAxis
        tickCount={12}
        tickFormat={x => moment(x).format('HH:mm')}
        style={{
          axis: styles.lines,
          tickLabels: styles.tickLabels,
          grid: styles.hidden
        }}
      />
      <VictoryScatter
        labelComponent={<VictoryTooltip />}
        style={styles.scatter}
        size={5}
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
