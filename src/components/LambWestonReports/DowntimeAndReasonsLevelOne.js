import React, { Component } from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTooltip } from 'victory';
import _ from 'lodash';

import styles, { COLORS } from './styles/style';
import './styles/style.css';

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const CHART_PADDING = 50;

// simulate API data
const labels = ['Uptime', 'Training', 'Sanitation', 'Quality Checks', 'Process Failure',
  'Planned Maintenance', 'No SuperReason', 'Minor Stop', 'MeetinsLunchBreaks',
  'Improvement Events', 'Equipment Breakdown', 'Changeover'];
const data = _.range(9).map((i) => {
  const value = _.random(5, 120);
  return ({
    x: labels[i],
    y: value,
    color: COLORS[i],
    label: `${labels[i]}: ${value}`
  });
});

class DowntimeAndReasonsLevelOne extends Component {
  state = {
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

  render() {
    return (
      <div className="Report__container">
        <div
          className="DowntimeAndReasonsLevelOne"
          ref={(node) => { this.container = node; }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <VictoryChart
            width={this.state.width - CHART_PADDING}
            height={this.state.height - CHART_PADDING}
            domainPadding={{ x: CHART_PADDING }}
            padding={{ top: 30, left: 45, right: 0, bottom: 40 }}
            style={styles.container}
          >
            <VictoryAxis
              style={{
                axis: styles.lines,
                grid: styles.hidden,
                tickLabels: styles.smallTickLabels
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: styles.hidden,
                grid: styles.lines,
                tickLabels: styles.tickLabels
              }}
            />
            <VictoryBar
              data={data}
              cornerRadius={7}
              barRatio={0.2}
              labelComponent={<VictoryTooltip label={d => d.y} />}
              style={{
                data: { fill: d => d.color }
              }}
            />
          </VictoryChart>
        </div>
        <div className="Report__bottomBar" />
      </div>
    );
  }
}

export default DowntimeAndReasonsLevelOne;
