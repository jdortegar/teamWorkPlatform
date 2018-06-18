import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { COLORS } from './styles/style';
import './styles/style.css';

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

class PlantUptimeMultiple extends Component {
  constructor() {
    super();
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(85, 125, 191)',
        spacing: [0, 0, 0, 0]
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
        tickWidth: 0,
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
  };

  componentDidMount() {
    const { from, until } = this.props;
    this.props.fetchData({ from, until, measure: 'minutes' });

    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    const { from, until } = nextProps;
    if (from !== this.props.from || until !== this.props.until) {
      this.props.fetchData({ from, until, measure: 'minutes' });
    }

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
          className="PlantUptimeMultiple"
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

PlantUptimeMultiple.propTypes = {
  from: PropTypes.string.isRequired,
  until: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default PlantUptimeMultiple;
