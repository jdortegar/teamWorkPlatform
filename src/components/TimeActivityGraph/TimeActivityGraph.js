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
import ReactTooltip from 'react-tooltip';

import String from '../../translations';
import styles from './styles/style';
import formatSize from '../../lib/formatSize';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// chart size properties
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const BOTTOM_OFFSET = 70;
const CHART_PADDING = 50;
const DOMAIN_TOP_PADDING = 20;

// from Victory. Increasing this number restrains the zoom level
const MINIMUM_ZOOM = 10000;

// from the beginning of the last year until tomorrow
const DATE_DOMAIN = [moment().subtract(1, 'year').startOf('year'), moment().add(1, 'day')];
const TIME_DOMAIN = [moment().startOf('day'), moment().endOf('day')];

// from 2 weeks before the last file to one day after
const defaultZoomDomain = (files) => {
  const lastFileDate = moment.max(files.map(file => file.date));
  return [moment(lastFileDate).subtract(2, 'weeks'), moment(lastFileDate).add(1, 'day')];
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
      height: MIN_HEIGHT
    };

    this.closeTooltip = this.closeTooltip.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  container = null;

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
    ReactTooltip.hide();
  }

  renderTooltipViews() {
    const { width, height, offsetLeft, offsetTop, tooltipPoint } = this.state;
    const { x, y, datum } = tooltipPoint;
    const { fileName, fileSize, resourceUri } = datum;
    const top = offsetTop + DOMAIN_TOP_PADDING + (height - y) + 4;
    const left = -offsetLeft + -CHART_PADDING + (width - x) + -120;

    return (
      <div
        onClick={() => this.closeTooltip()}
        className="tooltipOverlay"
      >
        <div
          data-tip
          data-for="global"
          className="tooltip"
          style={{
            position: 'absolute',
            left: offsetLeft,
            top: DOMAIN_TOP_PADDING,
            width,
            height
          }}
        />
        <ReactTooltip
          id="global"
          effect="solid"
          offset={{ top, left }}
        >
          <a
            onClick={() => {
              window.open(resourceUri, '_blank');
              this.setState({ tooltipPoint: null });
            }}
          >
            <p className="toolTipTextPrimary">{fileName}</p>
            <p className="toolTipTextSecondary">{String.t('timeActivityGraph.displayTime', datum)}</p>
            <p className="toolTipTextSecondary">{formatSize(fileSize)}</p>
          </a>
        </ReactTooltip>
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
              zoomDomain={{ x: defaultZoomDomain(files) }}
              minimumZoom={{ x: MINIMUM_ZOOM }}
            />
          }
        >
          <VictoryAxis
            offsetY={BOTTOM_OFFSET}
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
            events={[{
              target: 'data',
              eventHandlers: {
                //  onMouseOver: () => { },
                //  onMouseOut: () => { },
                onClick: (evt, clickedProps) => {
                  const { index, data } = clickedProps;
                  this.setState({ tooltipPoint: { x: evt.clientX, y: evt.clientY, datum: data[index] } });
                },
                onDoubleClick: (evt, clickedProps) => {
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
