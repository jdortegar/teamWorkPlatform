import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryScatter, VictoryZoomContainer } from 'victory';

import String from 'src/translations';
import formatSize from 'src/lib/formatSize';
import { integrationKeyFromFile, integrationImageFromKey } from 'src/utils/dataIntegrations';

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
  viewAll: true
};

// chart size properties
const MIN_WIDTH = 0;
const MIN_HEIGHT = 0;
const HEIGHT_ADJUSTMENT = 100;
const TOOLTIP_VERTICAL_OFFSET = 10;
const TOOLTIP_HORIZONTAL_OFFSET = 30;

// from Victory. Increasing this number restrains the zoom level
const MINIMUM_ZOOM = { x: 500000, y: 500000 };

// how much the zoom changes in each interaction
const ZOOM_DIFFERENCE = 0.1;

// from the first to the last file
const allZoomDomain = key => files => {
  const dates = files.map(file => file[key]);
  const lastFileDate = moment.max(dates);
  const firstFileDate = moment.min(dates);
  return [+moment(firstFileDate).subtract(1, 'month'), +moment(lastFileDate).add(1, 'week')];
};
const allXDomain = allZoomDomain('lastModified');
const allYDomain = allZoomDomain('fileCreatedAt');

const formatTick = date => {
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
  container = null;

  constructor(props) {
    super(props);

    const xDomain = allXDomain(props.files);
    const yDomain = allYDomain(props.files);

    this.state = {
      width: MIN_WIDTH,
      height: MIN_HEIGHT,
      fullDomain: { x: xDomain, y: yDomain },
      zoomDomain: { x: xDomain, y: yDomain }
    };

    this.closeTooltip = this.closeTooltip.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.files.length === 0 && nextProps.files !== 0) || nextProps.viewAll) {
      const xDomain = allXDomain(nextProps.files);
      const yDomain = allYDomain(nextProps.files);
      this.setState({ fullDomain: { x: xDomain, y: yDomain }, zoomDomain: { x: xDomain, y: yDomain } });
    } else if (nextProps.zoomLevel !== this.props.zoomLevel) {
      this.applyZoom(nextProps.zoomLevel, this.props.zoomLevel);
    }
  }

  handleZoomDomainChange = zoomDomain => {
    this.setState({ zoomDomain });
  };

  applyZoom = (newZoomLevel, oldZoomLevel) => {
    this.setState(prevState => {
      const { x, y } = prevState.zoomDomain;
      const xDiff = (x[1] - x[0]) * ZOOM_DIFFERENCE;
      const yDiff = (y[1] - y[0]) * ZOOM_DIFFERENCE;

      const domain = {};
      if (newZoomLevel > oldZoomLevel) {
        domain.x = [x[0] + xDiff, x[1] - xDiff];
        domain.y = [y[0] + yDiff, y[1] - yDiff];
      } else {
        domain.x = [x[0] - xDiff, x[1] + xDiff];
        domain.y = [y[0] - yDiff, y[1] + yDiff];
      }

      return { zoomDomain: domain };
    });
  };

  updateDimensions() {
    if (!this.container || !this.container.parentNode) return;
    const { clientWidth, clientHeight } = this.container.parentNode;
    const width = clientWidth;
    const height = clientHeight;

    this.setState({
      width: width < MIN_WIDTH ? MIN_WIDTH : width,
      height: height < MIN_HEIGHT ? MIN_HEIGHT : height
    });
  }

  closeTooltip() {
    this.setState({ tooltipPoint: null });
  }

  renderTooltipViews() {
    const { x, y, datum } = this.state.tooltipPoint;
    const { lastModified, fileName, fileSize } = datum;
    const top = y + TOOLTIP_VERTICAL_OFFSET;
    const left = x + TOOLTIP_HORIZONTAL_OFFSET;
    const displayDate = moment(lastModified).format(String.t('timeActivityGraph.dateFormat'));
    const displayTime = moment(lastModified).format(String.t('timeActivityGraph.timeFormat'));
    const imgSrc = integrationImageFromKey(integrationKeyFromFile(datum));

    return (
      <div onClick={() => this.closeTooltip()} className="tooltipOverlay" style={{ left, top }}>
        <div className="tooltipContainer">
          <img src={imgSrc} alt="" width={32} height={32} className="img" />
          <div className="tooltipTextContainer">
            <p className="toolTipTextPrimary">{fileName}</p>
            <p className="toolTipTextSecondary">
              {String.t('timeActivityGraph.displayTime', { displayDate, displayTime })}
            </p>
            <p className="toolTipTextSecondary">{formatSize(fileSize)}</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { files } = this.props;
    const { tooltipPoint, width, height, fullDomain, zoomDomain } = this.state;
    return (
      <div
        ref={node => {
          this.container = node;
        }}
        style={{ flex: 1, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT, position: 'relative' }}
      >
        {tooltipPoint && this.renderTooltipViews()}
        <VictoryChart
          scale="time"
          domain={fullDomain}
          width={width}
          height={height + HEIGHT_ADJUSTMENT}
          style={styles.container}
          padding={{ top: 0, left: 40, right: 0, bottom: 60 }}
          containerComponent={
            <VictoryZoomContainer
              zoomDomain={zoomDomain}
              minimumZoom={MINIMUM_ZOOM}
              onZoomDomainChange={this.handleZoomDomainChange}
            />
          }
        >
          <VictoryAxis
            tickFormat={formatTick}
            tickLabelComponent={<VictoryLabel lineHeight={1.3} style={styles.compoundTickLabels} />}
            style={{
              axis: styles.hidden,
              grid: styles.lines
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={formatTick}
            tickLabelComponent={<VictoryLabel lineHeight={1.3} style={styles.compoundTickLabels} />}
            style={{
              tickLabels: styles.tickLabels,
              axis: styles.lines,
              grid: styles.altLines
            }}
          />
          <VictoryScatter
            data={files}
            y="fileCreatedAt"
            x="lastModified"
            style={styles.scatter}
            labelComponent={<div />}
            dataComponent={<FilePoint />}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onMouseOver: (evt, clickedProps) => {
                    const { index, data } = clickedProps;
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
              }
            ]}
          />
        </VictoryChart>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
