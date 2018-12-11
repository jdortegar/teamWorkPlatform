import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import String from 'src/translations';
import formatSize from 'src/lib/formatSize';
import imageSrcFromFile from 'src/lib/imageFiles';
import addYPanToChart from 'src/lib/addYPanToChart';
import { integrationKeyFromFile, integrationImageFromKey } from 'src/utils/dataIntegrations';

import './styles/style.css';

addYPanToChart(Highcharts);

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
  tickPixelInterval: 100,
  title: {
    enabled: false
  },
  labels: {
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
    panning: true,
    panKey: 'shift',
    spacingLeft: 30,
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
    tickPixelInterval: 150
  },
  yAxis: {
    ...AXIS_OPTIONS,
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
