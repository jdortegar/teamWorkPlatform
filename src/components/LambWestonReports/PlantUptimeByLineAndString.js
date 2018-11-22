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

class PlantUptimeByLineAndString extends Component {
  container = null;
  highchart = null;

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
  };

  componentDidMount() {
    const { plant, from, until } = this.props;
    this.props.fetchData({ plant, from, until, measure: 'minutes' });

    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    const { plant, from, until } = nextProps;
    const shouldFetch = plant !== this.props.plant || from !== this.props.from || until !== this.props.until;
    if (shouldFetch) {
      this.props.fetchData({ plant, from, until });
    }

    if (!this.highchart.chart) return;
    if (_.isEqual(this.props.series, nextProps.series)) return;

    this.highchart.chart.update({ series: nextProps.series }, true, true);
  }

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
          ref={node => {
            this.container = node;
          }}
          style={{ minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
        >
          <HighchartsReact
            ref={node => {
              this.highchart = node;
            }}
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
          <div className="demoWrapper">
            <div className="demoContent">
              <p>
                This is an example of an Industry Use Case using Habla AI Manufacturing Data Visualization. For more
                information Contact Us at the Help Center.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlantUptimeByLineAndString.propTypes = {
  plant: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  until: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default PlantUptimeByLineAndString;
