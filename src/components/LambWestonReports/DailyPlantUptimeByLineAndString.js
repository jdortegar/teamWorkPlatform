import React, { Component } from 'react';
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

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const CHART_PADDING = 50;
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

class DailyPlantUptimeByLineAndString extends Component {
  state = {
    excludeFilter: {},
    width: MIN_WIDTH,
    height: MIN_HEIGHT
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  container = null;

  updateDimensions() {
    if (!this.container || !this.container.parentNode) return;
    const { clientWidth, clientHeight } = this.container.parentNode;

    this.setState({
      width: Math.max(clientWidth, MIN_WIDTH),
      height: Math.max(clientHeight, MIN_HEIGHT)
    });
  }

  handleFilterClick = (key) => {
    const { excludeFilter } = this.state;
    this.setState({ excludeFilter: { ...excludeFilter, [key]: excludeFilter[key] ? null : true } });
  }

  render() {
    const filteredData = _.omitBy(data, (value, key) => this.state.excludeFilter[key]);

    return (
      <div className="Report__container">
        <div
          className="DailyPlantUptimeByLineAndString"
          ref={(node) => { this.container = node; }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <VictoryChart
            scale={{ x: 'time' }}
            width={this.state.width - CHART_PADDING}
            height={this.state.height - CHART_PADDING}
            domainPadding={{ x: CHART_PADDING }}
            padding={{ top: 30, left: 45, right: 0, bottom: 60 }}
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
              {_.map(filteredData, (value, key) => (
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
        </div>

        <div className="Report__bottomBar">
          <AssetsFilters
            assets={filters}
            excludeFilter={this.state.excludeFilter}
            onFilterClick={this.handleFilterClick}
          />
        </div>
      </div>
    );
  }
}

export default DailyPlantUptimeByLineAndString;
