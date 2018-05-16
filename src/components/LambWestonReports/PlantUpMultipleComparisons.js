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
  'American Falls',
  'Boardman East',
  'Connel',
  'Delhi',
  'Park Rapids',
  'Pasco',
  'Richland'
];
const values = _.range(7).map(() => {
  return _.random(5, 120);
});

class PlanUpMultipleComparisons extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(85, 125, 191)'
      },
      colors: COLORS,
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        lineColor: '#819fd1',
        labels: {
          style: {
            color: '#819fd1'
          }
        }
      },
      yAxis: {
        title: false,
        gridLineColor: '#819fd1',
        labels: {
          align: 'left',
          x: 0,
          y: -10,
          style: {
            color: '#819fd1'
          }
        },
        minorGridLineColor: '#5e83bf',
        minorGridLineWidth: 1,
        minorTickLength: 0,
        minorTickInterval: 'auto'
      },
      plotOptions: {
        column: {
          borderRadius: 4
        },
        series: {
          borderWidth: 0,
          pointWidth: 10
        }
      },
      legend: {
        backgroundColor: '#FFFFFF',
        borderColor: '#ffffff',
        borderWidth: 8,
        itemHiddenStyle: {
          color: '#ddd'
        }
      },
      credits: {
        enabled: false
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

export default PlanUpMultipleComparisons;
