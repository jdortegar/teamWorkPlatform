import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from './styles/style';
import './styles/style.css';

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

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
      }
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
    const { categories, series } = this.props;

    return (
      <div className="Report__container">
        <div
          className="PlantUptimeByLineAndString"
          ref={(node) => { this.container = node; }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              ...this.chartOptions,
              series,
              xAxis: { ...this.chartOptions.xAxis, categories },
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

PlantUptimeByLineAndString.propTypes = {
  categories: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired
};

export default PlantUptimeByLineAndString;
