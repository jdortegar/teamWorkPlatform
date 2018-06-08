import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';

import { COLORS } from './styles/style';
import './styles/style.css';

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

class DailyPlantUptimeByLineAndString extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: 'rgb(85, 125, 191)',
        zoomType: 'x',
        spacing: [0, 0, 0, 0]
      },
      colors: COLORS,
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
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
        series: {
          lineWidth: 1,
          marker: {
            enabled: false
          }
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
      }
    };
  }

  state = {
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
    params: {
      plant: 'pasco',
      month: '2017-10'
    }
  };

  componentDidMount() {
    this.props.fetchData(this.state.params);
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.highchart.chart) return;
    if (_.isEqual(this.props.series, nextProps.series)) return;

    this.highchart.chart.update({ series: nextProps.series }, true, true);
  }

  container = null;
  highchart = null;

  updateDimensions() {
    if (!this.container || !this.container.parentNode) return;
    const { clientWidth, clientHeight } = this.container.parentNode;

    this.setState({
      width: Math.max(clientWidth, MIN_WIDTH),
      height: Math.max(clientHeight, MIN_HEIGHT)
    });
  }

  render() {
    const { series } = this.props;

    return (
      <div className="Report__container">
        <div
          className="DailyPlantUptimeByLineAndString"
          ref={(node) => { this.container = node; }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <HighchartsReact
            ref={(node) => { this.highchart = node; }}
            highcharts={Highcharts}
            options={{
              ...this.chartOptions,
              series,
              chart: {
                ...this.chartOptions.chart,
                height: this.state.height,
                width: this.state.width
              }
            }}
          />
        </div>
      </div>
    );
  }
}

DailyPlantUptimeByLineAndString.propTypes = {
  series: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default DailyPlantUptimeByLineAndString;
