import React from 'react';
import { VictoryChart, VictoryBar, VictoryGroup, VictoryAxis, VictoryLabel } from 'victory';
import moment from 'moment';
import _ from 'lodash';

import './styles/style.css';

const BACKGROUND_COLOR = '#557dbf';
const LINE_COLOR = '#dddddd';
const LINE_OPACITY = 0.4;

const tickLabels = {
  fill: LINE_COLOR,
  fillOpacity: LINE_OPACITY,
  fontFamily: 'Lato, sans-serif',
  textTransform: 'uppercase'
};

const styles = {
  container: {
    parent: {
      backgroundColor: BACKGROUND_COLOR
    }
  },
  tickLabels,
  compoundTickLabels: [
    tickLabels,
    { ...tickLabels, fillOpacity: 0.7 }
  ],
  axisLabel: {
    ...tickLabels,
    letterSpacing: 10
  },
  lines: {
    stroke: LINE_COLOR,
    strokeOpacity: LINE_OPACITY
  },
  hidden: {
    stroke: 'none'
  }
};

const today = moment().startOf('day');
const data = _.range(7).map(() => _.range(7).map(i => (
  { x: moment(today).subtract(i, 'days'), y: _.random(5, 120) }
)));

const ReportA = () => (
  <div className="ReportA">
    <VictoryChart
      scale={{ x: 'time' }}
      width={1000}
      height={650}
      domainPadding={{ x: 50 }}
      style={styles.container}
    >
      <VictoryAxis
        style={{
          axis: styles.lines,
          tickLabels: styles.tickLabels,
          axisLabel: styles.axisLabel,
          grid: styles.hidden
        }}
      />
      <VictoryAxis
        dependentAxis
        tickLabelComponent={
          <VictoryLabel
            lineHeight={1.3}
            style={styles.compoundTickLabels}
          />
        }
        style={{
          axis: styles.hidden,
          grid: styles.lines
        }}
      />
      <VictoryGroup
        offset={10}
        colorScale="qualitative"
      >
        {data.map((group, index) => (
          <VictoryBar key={`group-${index}`} data={group} />
        ))}
      </VictoryGroup>
    </VictoryChart>
  </div>
);

export default ReportA;
