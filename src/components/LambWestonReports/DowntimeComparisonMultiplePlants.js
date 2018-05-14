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
const labels = [
  'Pasco Oct',
  'Pasco Nov',
  'Pasco Dec',
  'Park Rapids Oct',
  'Park Rapids Nov',
  'Park Rapids Dec',
  'Delhi Oct',
  'Delhi Nov',
  'Delhi Dec'
];
const values = _.range(9).map(() => {
  return _.random(5, 120);
});

class DowntimeComparisonMultiplePlants extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(85, 125, 191)',
        height: '100%'
      },
      colors: COLORS,
      title: {
        text: null
      },
      xAxis: {
        type: 'category'
      },
      series: [
        {
          name: labels[0],
          data: [values[0]]
        },
        {
          name: labels[1],
          data: [values[1]]
        },
        {
          name: labels[2],
          data: [values[2]]
        },
        {
          name: labels[3],
          data: [values[3]]
        },
        {
          name: labels[4],
          data: [values[4]]
        },
        {
          name: labels[5],
          data: [values[5]]
        },
        {
          name: labels[6],
          data: [values[6]]
        },
        {
          name: labels[7],
          data: [values[7]]
        },
        {
          name: labels[8],
          data: [values[8]]
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
          className="PlanUpMultipeComparissions"
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

export default DowntimeComparisonMultiplePlants;
