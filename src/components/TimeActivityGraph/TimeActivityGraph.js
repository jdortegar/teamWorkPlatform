import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryZoomContainer
} from 'victory';

import String from '../../translations';
import formatSize from '../../lib/formatSize';
import { integrationKeyFromFile, integrationImageFromKey } from '../../utils/dataIntegrations';

import FilePoint from './FilePoint';
import styles from './styles/style';
import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  zoomLevel: PropTypes.number,
  viewAll: PropTypes.bool
};

const defaultProps = {
  files: [],
  zoomLevel: 0,
  viewAll: false
};

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const CHART_PADDING = 50;
const DOMAIN_TOP_PADDING = 20;

// from Victory. Increasing this number restrains the zoom level
const MINIMUM_ZOOM = 10000;

// how much the zoom changes in each interaction
const ZOOM_DIFFERENCE = 0.1;

// from the beginning of the last year until tomorrow
const DATE_DOMAIN = [moment().subtract(1, 'year').startOf('year'), moment().add(1, 'day')];
const TIME_DOMAIN = [moment().startOf('day'), moment().endOf('day')];

// from 2 weeks before the last file to one day after
const defaultZoomDomain = (files) => {
  const lastFileDate = moment.max(files.map(file => file.date));
  return [+moment(lastFileDate).subtract(2, 'weeks'), +moment(lastFileDate).add(1, 'day')];
};

// from the first to the last file
const allZoomDomain = (files) => {
  const dates = files.map(file => file.date);
  const lastFileDate = moment.max(dates);
  const firstFileDate = moment.min(dates);
  return [+moment(firstFileDate).subtract(1, 'day'), +moment(lastFileDate).add(1, 'day')];
};

const formatXTick = (date) => {
  const getFormat = () => {
    if (d3.timeMinute(date) < date) return String.t('timeActivityGraph.tickFormat.timeMinute'); // eg: "14:28:32 \n Dec 21"
    if (d3.timeDay(date) < date) return String.t('timeActivityGraph.tickFormat.timeDay'); // eg: "14:28 \n Dec 21"
    if (d3.timeMonth(date) < date) return String.t('timeActivityGraph.tickFormat.timeMonth'); // eg: "Dec 21"
    if (d3.timeYear(date) < date) return '%B'; // eg: "December"
    return '%Y'; // eg: "2018"
  };

  return d3.timeFormat(getFormat())(date);
};

class TimeActivityGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: MIN_WIDTH,
      height: MIN_HEIGHT,
      zoomDomain: defaultZoomDomain(props.files)
    };

    this.closeTooltip = this.closeTooltip.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.files.length === 0 && nextProps.files !== 0) {
      this.setState({ zoomDomain: defaultZoomDomain(nextProps.files) });
    }

    if (nextProps.zoomLevel !== this.props.zoomLevel) {
      this.applyZoom(nextProps.zoomLevel, this.props.zoomLevel);
    } else if (nextProps.viewAll) {
      this.setState({ zoomDomain: allZoomDomain(nextProps.files) });
    }
  }

  container = null;

  handleZoomDomainChange = (domain) => {
    this.setState({ zoomDomain: domain.x });
  }

  applyZoom = (newZoomLevel, oldZoomLevel) => {
    return newZoomLevel > oldZoomLevel ? this.zoomIn() : this.zoomOut();
  }

  zoomIn() {
    this.setState(({ zoomDomain }) => {
      const diff = (zoomDomain[1] - zoomDomain[0]) * ZOOM_DIFFERENCE;
      return { zoomDomain: [zoomDomain[0] + diff, zoomDomain[1] - diff] };
    });
  }

  zoomOut() {
    this.setState(({ zoomDomain }) => {
      const diff = (zoomDomain[1] - zoomDomain[0]) * ZOOM_DIFFERENCE;
      return { zoomDomain: [zoomDomain[0] - diff, zoomDomain[1] + diff] };
    });
  }

  updateDimensions() {
    if (!this.container || !this.container.parentNode) return;
    const { offsetLeft, offsetTop } = this.container;
    const { clientWidth, clientHeight } = this.container.parentNode;
    const width = clientWidth;
    const height = clientHeight;

    this.setState({
      width: (width < MIN_WIDTH ? MIN_WIDTH : width),
      height: (height < MIN_HEIGHT ? MIN_HEIGHT : height),
      offsetLeft,
      offsetTop
    });
  }

  closeTooltip() {
    this.setState({ tooltipPoint: null });
  }

  renderTooltipViews() {
    const { offsetLeft, offsetTop, tooltipPoint } = this.state;
    const { x, y, datum } = tooltipPoint;
    const { date, fileName, fileSize } = datum;
    const top = y - offsetTop;
    const left = x - (offsetLeft - CHART_PADDING);
    const displayDate = moment(date).format(String.t('timeActivityGraph.dateFormat'));
    const displayTime = moment(date).format(String.t('timeActivityGraph.timeFormat'));
    const imgSrc = integrationImageFromKey(integrationKeyFromFile(datum));

    return (
      <div
        onClick={() => this.closeTooltip()}
        className="tooltipOverlay"
        style={{ left, top }}
      >
        <div className="tooltipContainer">
          <img src={imgSrc} alt="" width={32} height={32} className="img" />
          <div className="tooltipTextContainer">
            <p className="toolTipTextPrimary">{fileName}</p>
            <p className="toolTipTextSecondary">{String.t('timeActivityGraph.displayTime', { displayDate, displayTime })}</p>
            <p className="toolTipTextSecondary">{formatSize(fileSize)}</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { files } = this.props;
    return (
      <div
        ref={(node) => { this.container = node; }}
        style={{ flex: 1, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
      >
        {this.state.tooltipPoint && this.renderTooltipViews()}
        <VictoryChart
          scale={{ x: 'time', y: 'time' }}
          domain={{ x: DATE_DOMAIN, y: TIME_DOMAIN }}
          domainPadding={{ y: [DOMAIN_TOP_PADDING, 0] }}
          width={this.state.width - CHART_PADDING}
          height={this.state.height - CHART_PADDING}
          padding={styles.chart.padding}
          style={styles.container}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              zoomDomain={{ x: this.state.zoomDomain }}
              minimumZoom={{ x: MINIMUM_ZOOM }}
              onZoomDomainChange={this.handleZoomDomainChange}
            />
          }
        >
          <VictoryAxis
            tickFormat={formatXTick}
            tickLabelComponent={
              <VictoryLabel
                lineHeight={1.3}
                style={styles.compoundTickLabels}
              />
            }
            style={{
              axis: styles.hidden,
              grid: styles.lines
            }}
          />
          <VictoryAxis
            invertAxis
            dependentAxis
            label={String.t('timeActivityGraph.yAxisLabel')}
            tickFormat={() => null}
            style={{
              axis: styles.lines,
              tickLabels: styles.tickLabels,
              axisLabel: styles.axisLabel,
              grid: styles.hidden
            }}
          />
          <VictoryScatter
            labelComponent={<div />}
            dataComponent={<FilePoint />}
            events={[{
              target: 'data',
              eventHandlers: {
                onMouseOver: (evt, clickedProps) => {
                  const { index, data } = clickedProps;
                  const { tooltipPoint } = this.state;
                  if (!tooltipPoint || tooltipPoint.datum.index !== index) {
                    this.setState({ tooltipPoint: { x: evt.clientX, y: evt.clientY, datum: data[index] } });
                  }
                },
                onMouseOut: () => {
                  this.setState({ tooltipPoint: null });
                },
                onClick: (evt, clickedProps) => {
                  const { index, data } = clickedProps;
                  window.open(data[index].resourceUri, '_blank');
                  this.setState({ tooltipPoint: null });
                }
              }
            }]}
            style={styles.scatter}
            size={5}
            data={files}
            x="date"
            y="time"
          />
        </VictoryChart>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
