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
import styles from './styles/style';

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
    const { clientWidth, clientHeight } = this.container.parentNode;
    const width = clientWidth;
    const height = clientHeight;

    this.setState({
      width: (width < MIN_WIDTH ? MIN_WIDTH : width),
      height: (height < MIN_HEIGHT ? MIN_HEIGHT : height)
    });
  }

  closeTooltip() {
    this.setState({ tooltipPoint: null });
  }

  renderTooltipViews() {
    const { x, y, datum } = this.state.tooltipPoint;
    console.log(`renderTooltipViews: (${x}, ${y}) - ${datum.label}`); // eslint-disable-line no-console
    return (
      <div
        onClick={() => this.closeTooltip()}
        className="tooltipOverlay"
      >
        <div />
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
                  const { x, y, index, data } = clickedProps;
                  this.setState({ tooltipPoint: { x, y, datum: data[index] } });
                }
                //  onDoubleClick: () => {
                //    return {
                //      target: 'labels',
                //      mutation: () => ({ active: false })
                //    };
                //  }
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
