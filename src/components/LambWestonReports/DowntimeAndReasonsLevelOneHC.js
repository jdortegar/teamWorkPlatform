import React, { Component } from 'react';
import _ from 'lodash';
import Higchcarts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from './styles/style';
import './styles/style.css';

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

// simulate API data
const labels = ['Uptime', 'Training', 'Sanitation', 'Quality Checks', 'Process Failure',
  'Planned Maintenance', 'No SuperReason', 'Minor Stop', 'MeetinsLunchBreaks',
  'Improvement Events', 'Equipment Breakdown', 'Changeover'];

const data = _.range(9).map((i) => {
  const value = _.random(5, 120);
  return ({
    name: labels[i],
    y: value,
    color: COLORS[i]
  });
});

class DowntimeAndReasonsLevelOneHC extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(85, 125, 191)'
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category'
      },
      legend: {
        enaDowntimeAndReasonsLevelOneHCbled: false
      },
      series: [
        {
          name: 'Downtime Reasons',
          data
        }
      ]
    };
  }

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
          className="DowntimeAndReasonsLevelOneHC"
          ref={(node) => { this.container = node; }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <HighchartsReact
            highcharts={Higchcarts}
            options={this.chartOptions}
          />
        </div>
      </div>
    );
  }
}

export default DowntimeAndReasonsLevelOneHC;
