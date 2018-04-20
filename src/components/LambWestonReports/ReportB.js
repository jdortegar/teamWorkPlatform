import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryGroup,
  VictoryAxis,
  VictoryLabel,
  createContainer
} from 'victory';
import moment from 'moment';
import _ from 'lodash';

import { AssetsFilters } from 'components';
import CustomTooltip from './CustomTooltip';
import styles, { COLORS } from './styles/style';
import './styles/style.css';

const MINIMUM_ZOOM = 500000000;

// simulate API data
const today = moment().startOf('day');
const randoms = _.range(31).map((i) => {
  const seed = 18 / (5 - (i % 5));
  return _.random(seed, seed + 3);
});
const buildAssetData = (asset) => {
  return [`Pasco L1 S${asset}`, {
    date: _.range(31).map(i => moment(today).subtract(i, 'days')),
    uptime: _.range(31).map(i => _.random(randoms[i], randoms[i] + 3))
  }];
};
const apiData = _.fromPairs(_.range(7).map(buildAssetData));

// transform API data
const data = _.mapValues(apiData, (item, key) => (
  item.date.map((date, index) => ({
    key,
    x: date,
    y: item.uptime[index]
  }))
));

const filters = Object.keys(data).map((item, index) => ({ label: item, color: COLORS[index] }));

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

const ReportB = () => (
  <div className="ReportB">
    <VictoryChart
      scale={{ x: 'time' }}
      width={1200}
      height={850}
      domainPadding={{ x: 50 }}
      domain={{ y: [0, 24] }}
      style={styles.container}
      containerComponent={
        <VictoryZoomVoronoiContainer
          zoomDimension="x"
          voronoiDimension="x"
          minimumZoom={{ x: MINIMUM_ZOOM }}
          labels={d => `${d.key}: ${d.y.toFixed(2)}`}
          labelComponent={<CustomTooltip />}
        />
      }
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
      <VictoryGroup offset={10}>
        {_.map(data, (value, key) => (
          <VictoryLine
            key={key}
            data={value}
            style={{
              data: { stroke: _.find(filters, ({ label }) => label === key).color }
            }}
          />
        ))}
      </VictoryGroup>
    </VictoryChart>

    <div className="ReportB__bottomBar">
      <AssetsFilters assets={filters} />
    </div>
  </div>
);

export default ReportB;
