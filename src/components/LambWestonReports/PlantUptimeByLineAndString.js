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
  'Pasco L1 S6',
  'Pasco L1 S7',
  'Pasco L1 S8',
  'Pasco L1 S9',
  'Pasco L1 S10',
  'Pasco L2 S2',
  'Pasco L2 S3',
  'Pasco L2 S4',
  'Pasco L2 S5'
];
const categories = ['2017/10/01', '2017/10/02', '2017/10/03', '2017/10/04', '2017/10/05', '2017/10/06'];
const dataRanges = _.range(9).map(() => {
  return _.range(6).map(() => {
    return _.random(5, 120);
  });
});

class PlantUptimeByLineAndString extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(85, 125, 191)',
        zoomType: 'x',
        spacing: [0, 0, 0, 0]
      },
      colors: COLORS,
      title: {
        text: null
      },
      xAxis: {
        categories,
        lineColor: '#819fd1',
        tickWidth: 0,
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
          x: 10,
          y: -10,
          style: {
            color: '#819fd1'
          }
        }
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
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        padding: 15,
        margin: 10,
        y: -10,
        borderRadius: 4,
        itemStyle: {
          fontSize: 11,
          color: '#999'
        },
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
          data: dataRanges[0]
        },
        {
          name: labels[1],
          data: dataRanges[1]
        },
        {
          name: labels[2],
          data: dataRanges[2]
        },
        {
          name: labels[3],
          data: dataRanges[3]
        },
        {
          name: labels[4],
          data: dataRanges[4]
        },
        {
          name: labels[5],
          data: dataRanges[5]
        },
        {
          name: labels[6],
          data: dataRanges[6]
        },
        {
          name: labels[7],
          data: dataRanges[7]
        },
        {
          name: labels[8],
          data: dataRanges[8]
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
          className="PlantUptimeByLineAndString"
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

export default PlantUptimeByLineAndString;
