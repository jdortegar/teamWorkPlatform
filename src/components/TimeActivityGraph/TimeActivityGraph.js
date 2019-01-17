import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import String from 'src/translations';
import formatSize from 'src/lib/formatSize';
import imageSrcFromFile from 'src/lib/imageFiles';
import handleChartPanning from 'src/lib/handleChartPanning';
import { integrationKeyFromFile, integrationImageFromKey } from 'src/utils/dataIntegrations';

import './styles/style.css';

handleChartPanning(Highcharts);

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  viewAll: PropTypes.bool,
  loading: PropTypes.bool
};

const defaultProps = {
  files: [],
  viewAll: false,
  loading: false
};

const ICON_SIZE = 26;

const formatData = files =>
  files.map(f => ({
    x: f.fileCreatedAt.valueOf(),
    y: f.lastModified.valueOf(),
    name: f.fileName,
    resourceUri: f.resourceUri,
    srcImg: integrationImageFromKey(integrationKeyFromFile(f)),
    formattedDate: String.t('timeActivityGraph.displayTime', {
      displayDate: f.lastModified.format(String.t('timeActivityGraph.dateFormat')),
      displayTime: f.lastModified.format(String.t('timeActivityGraph.timeFormat'))
    }),
    formattedSize: formatSize(f.fileSize),
    marker: {
      symbol: `url(${imageSrcFromFile(f.fileExtension)})`,
      height: ICON_SIZE,
      width: ICON_SIZE
    }
  }));

const AXIS_OPTIONS = {
  type: 'datetime',
  startOnTick: false,
  endOnTick: false,
  maxPadding: 0.1,
  minPadding: 0.1,
  minRange: 30000, // 30 seconds
  minTickInterval: 1000, // 1 second
  tickPixelInterval: 100,
  dateTimeLabelFormats: {
    second: String.t('timeActivityGraph.tickFormat.tickSecond'),
    minute: String.t('timeActivityGraph.tickFormat.tickMinute'),
    hour: String.t('timeActivityGraph.tickFormat.tickMinute'),
    day: String.t('timeActivityGraph.tickFormat.tickDay'),
    week: String.t('timeActivityGraph.tickFormat.tickDay'),
    month: String.t('timeActivityGraph.tickFormat.tickMonth'),
    year: String.t('timeActivityGraph.tickFormat.tickYear')
  },
  gridLineColor: 'rgb(255,255,255,0.3)',
  gridLineWidth: 1,
  lineWidth: 0,
  tickWidth: 0,
  title: {
    enabled: false
  },
  labels: {
    align: 'left',
    style: {
      color: 'rgb(255,255,255,0.4)',
      textTransform: 'uppercase'
    }
  }
};

const CHART_OPTIONS = {
  chart: {
    type: 'scatter',
    backgroundColor: 'rgb(85, 125, 191)',
    zoomType: 'xy',
    panning: 'xy',
    panKey: 'shift',
    animation: false,
    spacing: 0,
    resetZoomButton: {
      theme: {
        visibility: 'hidden'
      }
    }
  },
  credits: {
    enabled: false
  },
  title: {
    text: undefined
  },
  legend: {
    enabled: false
  },
  navigation: {
    buttonOptions: { enabled: false }
  },
  xAxis: {
    ...AXIS_OPTIONS,
    labels: { ...AXIS_OPTIONS.labels, x: 5, y: -12 },
    tickPixelInterval: 150
  },
  yAxis: {
    ...AXIS_OPTIONS,
    labels: { ...AXIS_OPTIONS.labels, x: 10, y: -8 },
    gridLineColor: 'rgb(255,255,255,0.1)'
  },
  tooltip: {
    useHTML: true,
    headerFormat: '<div class="tooltipContainer">',
    pointFormat: `
        <img src={point.srcImg} width="32" height="32" />
        <div class="tooltipTextContainer">
          <p class="tooltipTextPrimary">{point.name}</p>
          <p class="tooltipTextSecondary">{point.formattedDate}</p>
          <p class="tooltipTextSecondary">{point.formattedSize}</p>
        </div>`,
    footerFormat: `</div>`,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderColor: 'rgba(0,0,0,0.9)',
    borderRadius: 6
  },
  plotOptions: {
    scatter: {
      allowPointSelect: true,
      getExtremesFromAll: true,
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: 'rgb(100,100,100)'
          }
        }
      }
    },
    series: {
      cursor: 'pointer',
      animation: false,
      point: {
        events: {
          click: function click() {
            window.open(this.options.resourceUri, '_blank');
          }
        }
      }
    }
  },
  series: [
    {
      type: 'scatter',
      stickyTracking: false,
      turboThreshold: 0,
      boostThreshold: 1,
      data: []
    }
  ]
};

class TimeActivityGraph extends Component {
  container = null;
  highchart = null;

  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewAll) {
      this.highchart.chart.zoomOut();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.container && this.container.parentNode) {
      const { clientWidth, clientHeight } = this.container.parentNode;
      if (clientWidth !== prevState.width || clientHeight !== prevState.height) {
        this.updateDimensions();
      }
    }
  }

  updateDimensions = () => {
    if (!this.container || !this.container.parentNode) return;
    const { clientWidth, clientHeight } = this.container.parentNode;
    this.setState({ width: clientWidth, height: clientHeight });
  };

  render() {
    const { files, loading } = this.props;
    const { width, height } = this.state;

    return (
      <div
        className="TimeActivityGraph"
        ref={node => {
          this.container = node;
        }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          ref={node => {
            this.highchart = node;
          }}
          options={{
            ...CHART_OPTIONS,
            chart: { ...CHART_OPTIONS.chart, height, width },
            series: [{ ...CHART_OPTIONS.series[0], data: loading ? [] : formatData(files) }]
          }}
        />
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
